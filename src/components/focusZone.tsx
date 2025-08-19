interface ZoneProps {
    title: string;
    time: string;
    description: string;
    active?: boolean;
}

export default function FocusZone({ title, time, description, active = false }: ZoneProps) {
    return (
       <div className='flex items-center gap-4 relative'>
           <div className={`w-3 h-3 rounded-full mt-1 ${active ? 'bg-white' : 'bg-zinc-500'}`} />
           <div>
               {time && <p className='text-sm text-zinc-400 mb-1'>{time}</p>}
               <h2 className='text-md font-semibold'>{title}</h2>
               <p className='text-sm text-zinc-400 max-w-xs'>{description}</p>
           </div>
       </div>
    );
}