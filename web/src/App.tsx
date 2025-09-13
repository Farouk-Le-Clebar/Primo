import PrimoSvg from './assets/primo.svg?react'

const App = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <div className="flex items-center justify-center gap-3">
        <p className="text-4xl font-bold text-white">Welcome on </p>
        <PrimoSvg className="h-7 mt-2" />
      </div>
    </div>
  )
}

export default App
