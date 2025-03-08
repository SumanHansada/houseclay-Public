"use client";
import { Dialog, DialogContent } from "@/components/Dialog";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import Login from "@/components/Login";
import { useDialog } from "@/providers/DialogContextProvider";
import Image from "next/image";

export default function Home() {
  const { openDialog, isOpen } = useDialog();

  const onLogin = () => {
    openDialog("login-dialog");
  };

  return (
    <>
      <Header onLogin={onLogin} />
      <main className="mx-auto my-0">
        <section className="bg-[url('/images/banner-background.png')] bg-cover bg-center flex items-center justify-center min-h-[600px]">
          <div></div>
          {/* <div className="bg-[url('/images/banner-people.png')] h-screen flex flex-1">Hello</div> */}
        </section>
        <section className="bg-center flex flex-col items-center justify-center min-h-[500px] gap-10">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-center">Why Choose Us?</h1>
            <div className="text-center text-gray-600 font-thin">
              Discover the advantages of using our platform to find your perfect
              property.
            </div>
          </div>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col bg-white rounded-3xl shadow-lg p-6 justify-center items-center gap-6 w-72">
              <div>
                <Image
                  src="/icons/direct-owner-connections.svg"
                  alt="Direct Owner Connections"
                  width={150}
                  height={150}
                />
              </div>
              <div>
                <h1 className="font-bold">Direct Owner Connections</h1>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-3xl shadow-lg p-6 justify-center items-center gap-6  w-72">
              <div>
                <Image
                  src="/icons/use-connects.svg"
                  alt="Use Connects"
                  width={150}
                  height={150}
                />
              </div>
              <div>
                <h1 className="font-bold">Use Connects</h1>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-3xl shadow-lg p-6 justify-center items-center gap-6  w-72">
              <div>
                <Image
                  src="/icons/pay-as-you-go.svg"
                  alt="Pay as you go"
                  width={150}
                  height={150}
                />
              </div>
              <div>
                <h1 className="font-bold">Pay as you go</h1>
              </div>
            </div>
          </div>
        </section>

        {isOpen("login-dialog") && (
          <Dialog
            id="login-dialog"
            direction="center"
            overlayClose={true}
            borderRadius="all"
          >
            <DialogContent>
              <Login />
            </DialogContent>
          </Dialog>
        )}
      </main>
      <Footer />
    </>
  );
}
