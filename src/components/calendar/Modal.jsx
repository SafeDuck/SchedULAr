import { AiOutlinePlus } from "react-icons/ai";

const Modal = ({ event, setEvent }) => {
  return (
    <div className=" bg-blue-400 font-playfair fixed  left-2/3  -translate-y-3 w-[75vw] md:w-[30vw] bg-saf-red z-10 drop-shadow-lg">
      <div className={`flex justify-between items-center`}>
        <p
          className={
            " m-0 py-2 md:py-3 px-3 md:px-4 text-lg md:text-2xl text-white"
          }
        >
          {event.title}
        </p>

        {/* <div className="absolute right-2 md:py-3 px-12 md:px-12 text-lg md:text-2xl text-white">
          Hello
        </div> */}

        <AiOutlinePlus
          onClick={() => setEvent(null)}
          className="text-white rotate-45 p-0 hover:scale-110 duration-300 hover:cursor-pointer text-3xl m-3"
        />
      </div>
      <div className="p-3">
        {/* <p className="m-0 pl-2 text-white">Location</p> */}

        <div className="md:text-lg text-sm p-2 text-white">Description</div>
      </div>
    </div>
  );
};

export default Modal;
