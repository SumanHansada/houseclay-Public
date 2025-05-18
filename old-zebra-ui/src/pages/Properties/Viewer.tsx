import { Outlet } from "react-router-dom";

const Viewer = () => {
  return (
    <>
      <div>List of Properties</div>
      <Outlet />
    </>
  );
};

export default Viewer;
