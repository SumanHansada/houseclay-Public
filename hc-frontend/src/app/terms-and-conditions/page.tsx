"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Footer, MobileHeader } from "@/layout-components";
import { useDeviceContext } from "@/providers/DeviceContextProvider";
import { setHideFooter, setHideHeader } from "@/store/appSlice";

export default function TermsAndConditionsPage() {
  const { isMobile } = useDeviceContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      dispatch(setHideHeader(true));
      dispatch(setHideFooter(true));
    } else {
      dispatch(setHideHeader(false));
      dispatch(setHideFooter(false));
    }
  }, [isMobile, dispatch]);

  return (
    <>
      <MobileHeader title="Terms and Conditions" />

      <section className="w-full">
        <div className="w-full text-center mb-8">
          <h1 className="text-4xl font-bold py-24 max-md:hidden">
            Terms and Conditions
          </h1>
        </div>
        <div className="flex flex-col gap-8 xl:w-1/2 lg:w-2/3 md:w-3/4 max-md:px-8 mb-16 pb-5 mx-auto">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 sm:text-lg">
              Lorem ipsum dolor sit amet consectetur. Pellentesque vel sodales
              purus in egestas at vestibulum tellus. Dolor ut justo a
              ullamcorper. Mauris sit facilisis tortor malesuada magna.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lorem ipsum dolor
            </h2>
            <ul className="list-disc ml-8 text-gray-700 sm:text-lg space-y-1">
              <li>
                Lorem ipsum dolor sit amet consectetur. Pellentesque vel sodales
                purus in egestas at vestibulum tellus. Dolor ut justo a
                ullamcorper. Mauris sit facilisis tortor malesuada magna.
              </li>
              <li>
                Et nulla facilisi interdum pellentesque fringilla mauris
                suspendisse lorem lacus.
              </li>
              <li>
                A pellentesque praesent malesuada venenatis. Dolor tellus a
                mauris ipsum porttitor tincidunt fermentum. Ullamcorper nulla
                lectus eu mauris orci amet nunc porta nunc.
              </li>
              <li>
                Et quam lacus nunc ac. Cras cursus vitae scelerisque duis nec
                mattis semper. Porta nunc dolor vel at ultrices vestibulum fames
                sed non. Velit enim leo elementum integer libero. Sed in non.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lorem ipsum dolor
            </h2>
            <ul className="list-disc ml-8 text-gray-700 sm:text-lg space-y-1">
              <li>
                Lorem ipsum dolor sit amet consectetur. Pellentesque vel sodales
                purus in egestas at vestibulum tellus. Dolor ut justo a
                ullamcorper. Mauris sit facilisis tortor malesuada magna.
              </li>
              <li>
                Et nulla facilisi interdum pellentesque fringilla mauris
                suspendisse lorem lacus.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lorem ipsum dolor
            </h2>
            <ul className="list-disc ml-8 text-gray-700 sm:text-lg space-y-1">
              <li>
                Et nulla facilisi interdum pellentesque fringilla mauris
                suspendisse lorem lacus.
              </li>
              <li>
                A pellentesque praesent malesuada venenatis. Dolor tellus a
                mauris ipsum porttitor tincidunt fermentum. Ullamcorper nulla
                lectus eu mauris orci amet nunc porta nunc.
              </li>
              <li>
                Et quam lacus nunc ac. Cras cursus vitae scelerisque duis nec
                mattis semper. Porta nunc dolor vel at ultrices vestibulum fames
                sed non. Velit enim leo elementum integer libero. Sed in non.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lorem ipsum dolor
            </h2>
            <p className="text-gray-700 sm:text-lg space-y-1">
              You agree not to:
            </p>
            <ul className="list-disc ml-8 text-gray-700 sm:text-lg space-y-1">
              <li>
                Lorem ipsum dolor sit amet consectetur. Pellentesque vel sodales
                purus in egestas at vestibulum tellus. Dolor ut justo a
                ullamcorper. Mauris sit facilisis tortor malesuada magna.
              </li>
              <li>
                Et nulla facilisi interdum pellentesque fringilla mauris
                suspendisse lorem lacus.
              </li>
              <li>
                A pellentesque praesent malesuada venenatis. Dolor tellus a
                mauris ipsum porttitor tincidunt fermentum. Ullamcorper nulla
                lectus eu mauris orci amet nunc porta nunc.
              </li>
              <li>
                Et quam lacus nunc ac. Cras cursus vitae scelerisque duis nec
                mattis semper. Porta nunc dolor vel at ultrices vestibulum fames
                sed non. Velit enim leo elementum integer libero. Sed in non.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lorem ipsum dolor
            </h2>
            <ul className="list-disc ml-8 text-gray-700 sm:text-lg space-y-1">
              <li>
                Lorem ipsum dolor sit amet consectetur. Pellentesque vel sodales
                purus in egestas at vestibulum tellus. Dolor ut justo a
                ullamcorper. Mauris sit facilisis tortor malesuada magna.
              </li>
              <li>
                Et nulla facilisi interdum pellentesque fringilla mauris
                suspendisse lorem lacus.
              </li>
              <li>
                A pellentesque praesent malesuada venenatis. Dolor tellus a
                mauris ipsum porttitor tincidunt fermentum. Ullamcorper nulla
                lectus eu mauris orci amet nunc porta nunc.
              </li>
              <li>
                Et quam lacus nunc ac. Cras cursus vitae scelerisque duis nec
                mattis semper. Porta nunc dolor vel at ultrices vestibulum fames
                sed non. Velit enim leo elementum integer libero. Sed in non.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Lorem ipsum dolor
            </h2>
            <p className="text-gray-700 sm:text-lg">
              Lorem ipsum dolor sit amet consectetur. Pellentesque vel sodales
              purus in egestas at vestibulum tellus. Dolor ut justo a
              ullamcorper. Mauris sit facilisis tortor malesuada magna.
            </p>
          </div>
        </div>
      </section>
      <div className="max-md:hidden w-full">
        <Footer />
      </div>
    </>
  );
}
