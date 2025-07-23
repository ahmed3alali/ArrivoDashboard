import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import logo from "../pictures/ArrivoLogo.webp"
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "../adminAuth/UserContext"
import { t } from "i18next";


const TOKEN_AUTH = gql`
  mutation TokenAuth($input: ObtainJSONWebTokenInput!) {
    tokenAuth(input: $input) {
      token
    }
  }
`;




export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSucess] = useState(false);
  const [tempLoading, setTempLoading] = useState(false);
  const [isSucessLogin, setIsSuccessLogin] = useState(false);
  const [tempError, settempError] = useState("");
  const [tokenAuth, { loading, error, data }] = useMutation(TOKEN_AUTH);

  const navigate = useNavigate();
  const { setUser } = useUser(); 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (tempLoading) {
    return;
  }
  settempError("");
  setTempLoading(true);

  try {
    const response = await tokenAuth({
      variables: {
        input: { username, password },
      },
    });
    setTempLoading(false);

    const token = response.data.tokenAuth.token;
    document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure;`;



    // Set user in context and localStorage (you can customize this)
    setUser({ name: username, email: "" });
    document.cookie = `userName=${encodeURIComponent(username)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure;`;
document.cookie = `userEmail=;  path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure;`; // set empty for now




    
   setShowSucess(true)
   setIsSuccessLogin(true)
   setTimeout(() => {
     navigate("/");
   }, 1000);
  } catch (err) {
    setTempLoading(false);
    console.error("Login error", err);
    settempError(t("InvalidCredentials"));
  }
};


  return (
    <div className="min-h-screen flex flex-col sm:flex-col md:flex-row  xl:flex-row items-center justify-center gap-8 bg-gray-100 dark:bg-gray-900 p-4">
<div className="logo-Container">
<img src={logo}></img>

</div>

      <Card className="w-full max-w-md shadow-2xl border-none rounded-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t("Login")}</CardTitle>
        </CardHeader>
        <CardContent>

        {showSuccess && (
  <Alert variant="default" className="mb-4 text-green-800">
    <AlertTitle>{t("Success")}</AlertTitle>
    <AlertDescription>{t("LoginSuccess")}</AlertDescription>
  </Alert>
)}

{tempError && (
  <Alert variant="destructive" className="mb-4">
    <AlertTitle>{t("Loginfailed")}</AlertTitle>
    <AlertDescription>{tempError}</AlertDescription>
  </Alert>
)}


          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">{t("Username")}</Label>
              <Input
                id="username"
                type="text"
                
                placeholder={t("EnterUser")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">{t("Password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

      

            <Button
              type="submit"
              className={cn("w-full", tempLoading && "opacity-70 cursor-not-allowed")}
              disabled={tempLoading || isSucessLogin}
            > 
              {tempLoading ? "Signing in please wait..." : t("SignIn")}
            </Button>

           
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
