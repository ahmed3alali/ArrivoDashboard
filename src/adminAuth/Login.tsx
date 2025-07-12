import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Cookies from "js-cookie";

const TOKEN_AUTH = gql`
  mutation TokenAuth($input: ObtainJSONWebTokenInput!) {
    tokenAuth(input: $input) {
      token
    }
  }
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokenAuth, { loading, error, data }] = useMutation(TOKEN_AUTH);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await tokenAuth({
        variables: {
          input: {
            username,
            password,
          },
        },
      });

      const token = response.data.tokenAuth.token;

      // Save token in cookie for 7 days
      Cookies.set("authToken", token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      alert("Login successful!");
      window.location.href = "/dashboard"; // or navigate programmatically
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">Error: {error.message}</p>}
    </div>
  );
}
