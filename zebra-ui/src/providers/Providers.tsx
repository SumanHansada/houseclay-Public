import { DeviceContextProvider } from "./DeviceContextProvider";
import { DialogContextProvider } from "./DialogContextProvider";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import { SkeletonProvider } from "./SkeletonProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <QueryProvider>
        <DeviceContextProvider>
          <DialogContextProvider>
            <SkeletonProvider>{children}</SkeletonProvider>
          </DialogContextProvider>
        </DeviceContextProvider>
      </QueryProvider>
    </ReduxProvider>
  );
};

export default Providers;
