import { FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertCircle, Lock, User } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";

export type UserType = {
    id: number;
    // email: string;
    username: string;
    password?: string;
    balance: number;
    unrealizedPnl: number;
    realizedPnl: number;
    token: string;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: (user: any) => void; }) {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const loginMutation = useMutation({
        mutationFn: async (data: { username: string; password: string }) => {
            console.log("Attempting login with data:", data);
            const res = await fetch('http://localhost:8080/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const jsonRes = await res.json();
            console.log("Login response:", jsonRes);
            return jsonRes;
        },
        onSuccess: (data) => {
            localStorage.setItem('currentUserId', data.id)
            localStorage.setItem('authToken', data.token)
            // localStorage.setItem('currentUserEmail', data.email)
            onSuccess(data)
        },
        onError: (error: any) => {
            console.error(error, "Login error")
            setError("Login failed. Please check your credentials and try again.")
        }
    })

    const signupMutation = useMutation({
        mutationFn: async (data: { username: string; password: string }) => {
            console.log("Attempting signup with data:", data);
            const res = await fetch('http://localhost:8080/api/v1/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const jsonRes = await res.json()
            console.log("Signup response:", jsonRes);
            return jsonRes;
        },
        onSuccess: (data) => {
            console.log("Signup successful:", data);
            localStorage.setItem('currentUserId', data.id)
            localStorage.setItem('authToken', data.token)
            onSuccess(data)
        },
        onError: (error: any) => {
            console.error(error, "Signup error")
            setError("Signup failed. Please try again with a different username.")
        }
    })

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
        setError("Please fill in all fields");
        return;
    }

    setIsProcessing(true);
    setError("");

    try {
        if (isLogin) {

            // For demo purposes, we'll find user by username
            // const users = [{ id: "1", email: "demo", username: "demo", password: "demo" }]
            // // const users = await base44.entities.User.filter({ username });
            // const user = users.find(u => u.password === password);

            // if (!user) {
            //     setError("Invalid username or password");
            //     setIsProcessing(false);
            //     return;
            // }

            // // Store user session (simplified for demo)
            // localStorage.setItem('currentUserId', user.id);
            // localStorage.setItem('currentUserEmail', user.email);
            // onSuccess(user);
            loginMutation.mutate({ username, password });
        } else {
            // Check if username already exists
            // const existingUsers = [];
            // // const existingUsers = await base44.entities.User.filter({ username });
            // if (existingUsers.length > 0) {
            //     setError("Username already exists");
            //     setIsProcessing(false);
            //     return;
            // }

            // // Get current user and update with username/password and trading data
            // const currentUser = { id: "1", email: "demo", username: "demo", password: "demo" };
            // const currentUser = await base44.auth.me();
            // await base44.auth.updateMe({
            //   username,
            //   password,
            //   balance: 100000,
            //   realized_pnl: 0
            // });

            // const updatedUser = { id: "1", email: "demo", username: "demo", password: "demo" };
            // // const updatedUser = await base44.auth.me();
            // localStorage.setItem('currentUserId', updatedUser.id);
            // localStorage.setItem('currentUserEmail', updatedUser.email);

            // onSuccess(updatedUser);

            signupMutation.mutate({ username, password });
        }

        setUsername("");
        setPassword("");
        onClose();
    } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication failed. Please try again.");
    }

    setIsProcessing(false);
};

const handleClose = () => {
    setUsername("");
    setPassword("");
    setError("");
    onClose();
};

return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#141b2d] border-white/10 text-white max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                    <User className="w-5 h-5 text-blue-400" />
                    {isLogin ? "Login" : "Sign Up"}
                </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">
                        Username
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-10 bg-[#0a0e27] border-white/10 text-white h-12"
                            disabled={isProcessing}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">
                        Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-[#0a0e27] border-white/10 text-white h-12"
                            disabled={isProcessing}
                        />
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 font-semibold cursor-pointer"
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
                </Button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                        disabled={isProcessing}
                    >
                        {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
                    </button>
                </div>

                {!isLogin && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-blue-400 text-sm">
                            New traders start with $100,000 in virtual cash to practice trading.
                        </p>
                    </div>
                )}
            </form>
        </DialogContent>
    </Dialog>
);
}