import React, {useEffect, useState} from 'react';
import {GetBoardDto} from "/src/Api.ts";
import {http} from "/src/http";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";

const BoardsPage = () => {
    const [boards, setBoards] = useState<GetBoardDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBoards = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await http.boardList()
                setBoards(response.data)
            } catch (err) {
                console.error(err)
                setError('Failed to fetch boards')
            } finally {
                setIsLoading(false)
            }
        }
        fetchBoards()
    }, []);

    return (
        <div>
            <NavBarPlayer/>

            <div className="container mx-auto py-6">

                <h1>Lorem ipsum dolor.</h1>
                {isLoading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {boards.map((board) => (
                    <div key={board.id}>
                        <h2>Board id: {board.id}</h2>
                        <p>Game ID: {board.gameId}</p>
                        <p>Number of players: {board.numbers?.join(", ") || "None"}</p>
                    </div>
                ))}
                {!isLoading && !error && boards.length === 0 && <p>No boards found</p>}
            </div>
        </div>
    );
};

export default BoardsPage;