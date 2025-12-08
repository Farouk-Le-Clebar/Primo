const Spinner = () => {
    return (
        <div className="flex justify-center items-center h-full w-full flex flex-col gap-4 text-agendai font-bold text-xl">
            <div className="w-20 h-20 border-5 border-agendai border-t-transparent rounded-full animate-spin" />
            <p>Loading...</p>
        </div>
    )
}

export default Spinner