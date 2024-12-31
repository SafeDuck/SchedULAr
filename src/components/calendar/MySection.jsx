const CustomEvent = ({ event }) => {
  return (
    <div className="py-1 h-full flex flex-col gap-1">
      <p className="inline text-black">
        {event.course} - {event.title}
      </p>
      <p className="inline text-black">{event.location}</p>
    </div>
  );
};

export default CustomEvent;
