'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@heroui/input"
import { Button, ButtonGroup } from "@heroui/button"
import { Form } from "@heroui/form"
import { Link } from "@heroui/link"
import { createClient } from '@/utils/supabase/client'
import { NavigationBarNoAuth } from '@/components/NavbarNoAuth'

const supabase = createClient();

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('../')
    }
    checkAuth()
  }, [router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (email !== emailConfirm) {
      setError('Emails must be the same');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords must be the same');
      return;
    }

    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: `${username}` }
      }
    })

    if (authError) {
      setError(authError.message)
    } else if (data.session) {
      router.push('../')
    } else {
      setError('Please check your email to confirm your account.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBarNoAuth />

      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md transform transition-all">
          <Form onSubmit={handleSignup} className="w-full space-y-6 p-8 bg-white rounded-lg shadow-lg">
            <div className="w-full space-y-4">
              <h1 className="text-2xl font-bold text-center text-purple-500 mb-8">
                Create New Account
              </h1>

              {error && (
                <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="focus:ring-purple-500 focus:border-purple-500"
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="focus:ring-purple-500 focus:border-purple-500"
              />

              <Input
                label="Confirm email"
                type="email"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                required
                placeholder="Confirm your email"
                className="focus:ring-purple-500 focus:border-purple-500"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="focus:ring-purple-500 focus:border-purple-500"
              />

              <Input
                label="Confirm password"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                placeholder="Confirm your password"
                className="focus:ring-purple-500 focus:border-purple-500"
              />

              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-sm text-purple-600 hover:text-purple-800"
                  underline="always"
                >
                  Log in
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
