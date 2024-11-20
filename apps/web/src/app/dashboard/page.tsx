'use client'

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Copy, CreditCard, Key, User, Menu } from 'lucide-react'
import { UserButton } from "@clerk/nextjs"

const apiUsageData = [
  { name: 'Mon', requests: 120 },
  { name: 'Tue', requests: 200 },
  { name: 'Wed', requests: 150 },
  { name: 'Thu', requests: 180 },
  { name: 'Fri', requests: 90 },
  { name: 'Sat', requests: 75 },
  { name: 'Sun', requests: 60 },
]

export default function Dashboard() {
  const { user } = useUser()
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const generateKey = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/key", {
        method: "POST",
      })
      const data = await response.json()
      setApiKey(data.key)
    } catch (error) {
      console.error("Error generating key:", error)
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-400 text-black font-mono">
      <header className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-gray-400 shadow-md py-2' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className={`transition-all duration-300 ${isScrolled ? 'scale-75' : 'scale-100'}`}>
            <h1 className="text-4xl font-bold font-sans">Infer</h1>
            <p className={`mt-2 text-lg transition-all duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
              A powerful, type-safe SDK for ML inference operations.
            </p>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Button asChild className="bg-black text-white hover:bg-gray-800">
              <Link href="/">Home</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </nav>
          <Button variant="ghost" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-400 p-4">
            <Button asChild className="w-full mb-2 bg-black text-white hover:bg-gray-800">
              <Link href="/">Home</Link>
            </Button>
            <div className="flex justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        )}
      </header>

      <main className="pt-32 p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-gray-200 border-2 border-black">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="api-key">API Key</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-gray-200 border-2 border-black">
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Your API request volume for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    requests: {
                      label: "Requests",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={apiUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="requests" fill="var(--color-requests)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-600">Total Requests: 875</p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="api-key">
            <Card className="bg-gray-200 border-2 border-black">
              <CardHeader>
                <CardTitle>Your API Key</CardTitle>
                <CardDescription>Generate and manage your API key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!apiKey ? (
                  <Button
                    onClick={generateKey}
                    disabled={loading}
                    className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Generate API Key"}
                  </Button>
                ) : (
                  <div className="bg-white p-4 rounded-md border-2 border-black flex items-center justify-between">
                    <code className="text-sm break-all">{apiKey}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey)}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy API key</span>
                    </Button>
                  </div>
                )}
                {apiKey && (
                  <p className="text-sm text-gray-600">
                    Store this key securely. You won&apos;t be able to see it again.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="bg-gray-200 border-2 border-black">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your billing and view current charges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-md border-2 border-black">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-2" />
                    <span>Current Plan: Pro</span>
                  </div>
                  <span className="font-bold">$49.99/month</span>
                </div>
                <div className="p-4 bg-white rounded-md border-2 border-black">
                  <h3 className="font-semibold mb-2">Current Bill</h3>
                  <p className="text-2xl font-bold">$37.50</p>
                  <p className="text-sm text-gray-600">Next billing date: June 1, 2023</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-black text-white hover:bg-gray-800">Upgrade Plan</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="bg-gray-200 border-2 border-black">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{user?.fullName || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={user?.username || ''} readOnly className="bg-white" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-black text-white hover:bg-gray-800">Edit Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}