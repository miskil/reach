import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Database } from "lucide-react";
//import { Terminal } from './terminal';
import { getUser } from "@/lib/db/queries";
import Image from "next/image";
import { subdomainURL } from "@/lib/utils";

export default async function HomePage() {
  const user = await getUser();
  let nextURL = "";
  if (user && user.siteId) {
    nextURL = subdomainURL(user.siteId, "/pages");
  } else if (user) nextURL = "./registersite";
  else nextURL = "./sign-up";
  /*
  const  nextURL = ()=>{
    if (user && user.siteId)
        return `./${user.siteId}`
    else if (user)
        return './registersite'
    else
        return './signup'
  }
        */

  return (
    <main>
      <section
        className="py-20"
        style={{
          backgroundImage: "url('/reachhero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Build Your Reach
                <span className="block text-orange-500">Faster Than Ever</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Launch your Reach website in record time with our powerful,
                tools to integrate with social media and communicate with your
                users.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                {user ? (
                  <a href={nextURL}>
                    <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                      Resume
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="text-base text-gray-600">
                      Already have an account?
                    </div>
                    <div className="text-base">
                      <a
                        href="./sign-in"
                        className="text-blue-500 hover:underline"
                      >
                        Log in
                      </a>
                    </div>
                    <div className="text-base text-gray-600">
                      or to create new account
                    </div>
                    <div className="text-base">
                      <a
                        href="./sign-up"
                        className="text-blue-500 hover:underline"
                      >
                        Register
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
