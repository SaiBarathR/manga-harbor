import SearchBar from "./SearchBar";
import { Toolbar } from "./ToolBar";


export default function Home() {

    return <div className="w-full h-screen">
        <div className="flex h-screen">
            <SideBar />
            <Toolbar />
        </div>
        <SearchBar />
    </div>
}

function SideBar() {
    return <aside className=' mx-4 my-4 bg-cyan-900 max-w-[300px] h-5/6 min-w-[200px] rounded-lg p-2'>
    </aside>
}