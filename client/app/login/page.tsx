'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Input } from "@heroui/input"
import { Button, ButtonGroup } from "@heroui/button"
import { Form } from "@heroui/form";

const supabase = createClient();

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('../')
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('../')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white p-4 text-purple-500">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">GitGud At Studying</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md transform transition-all">
          <Form onSubmit={handleLogin} className="w-full space-y-6 p-8 bg-white rounded-lg shadow-lg">
            <div className="w-full space-y-4">
              <h1 className="text-2xl font-bold text-center text-purple-500 mb-8">
                Login to Your Account
              </h1>

              {error && (
                <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

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
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="focus:ring-purple-500 focus:border-purple-500"
              />

              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <Button
                  variant="bordered"
                  onClick={() => router.push('/signup')}
                  className="text-purple-600 hover:text-purple-800 font-medium px-1.5"
                >
                  Create one
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
