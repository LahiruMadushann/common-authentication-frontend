import toast from 'react-hot-toast';

const toastClass =
  ' bg-[#002b5c] w-80 py-2 text-white border border-white  rounded-lg shadow-md flex items-center justify-center';

const setSuccessToast = (msg: any) => {
  return toast.custom(
    <div className={toastClass}>
      <span>{msg}</span>
    </div>
  );
};

const setCustomErrorToast = (error: any) => {
  return toast.custom(
    <div className={toastClass}>
      <span>{error}</span>
    </div>
  );
};

export { setSuccessToast, setCustomErrorToast };
