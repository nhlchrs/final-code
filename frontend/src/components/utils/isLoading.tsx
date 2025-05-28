import React, { useState, ComponentType } from "react";
import { ClipLoader } from "react-spinners";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-[9999]">
      <ClipLoader size={80} color="#644D29" />
    </div>
  );
};

function IsLoadingHOC<P>(
  WrappedComponent: ComponentType<P & { isLoading: boolean; setLoading: (loading: boolean) => void }>
): React.FC<P> {
  const HOC: React.FC<P> = (props) => {
    const [isLoading, setLoading] = useState(false);

    const setLoadingState = (loading: boolean) => {
      setLoading(loading);
    };

    return (
      <>
        {isLoading && <Loading />}
        <WrappedComponent
          {...props}
          isLoading={isLoading}
          setLoading={setLoadingState}
        />
      </>
    );
  };

  return HOC;
}

export default IsLoadingHOC;
