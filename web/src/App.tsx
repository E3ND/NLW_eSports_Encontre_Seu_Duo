import { useEffect, useState } from 'react'
import axios from 'axios'
import * as Dialog from '@radix-ui/react-dialog'

import './styles/main.css'

import logoImg from './assets/Logo-nlw-esports.svg'

import { GameBanner } from './components/GameBanner'
import { CreateAdBanner } from './components/CreateAdBanner'
import { CreateAdModel } from './components/CreateAdModel'

interface Game {
    id: string;
    title: string;
    banner: string;
    _count: {
        ads: number;
    }
}

function App() {
    const [games, setGames] = useState<Game[]>([])

    useEffect(() => {
        axios('http://localhost:3333/games').then(response => {
            setGames(response.data)
        })
    }, [])

    return (
        <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
            <img src={logoImg} alt="Logo NLW Esports" />

            <h1 className="text-6xl text-white font-black mt-20">
                Seu <span className="text-transparent bg-nlw-gradient bg-clip-text">duo</span> está aqui.
            </h1>

            <div className="grid grid-cols-6 gap-6 mt-16 mb-7">
                {games.map((game) => {
                    return (
                        <GameBanner
                            key={game.id}
                            bannerUrl={game.banner}
                            title={game.title}
                            adsCount={game._count.ads}
                        />
                    )
                })}
                
            </div>

            {/* Acessibilidade Radix */}
            <Dialog.Root>
                <CreateAdBanner />

                <CreateAdModel />

            </Dialog.Root>

            
        </div>
    )
}
//1:04:44
export default App
