import React, {FC, useState} from "react";
import NavBarPlayer from "/src/components/playerComponents/NavBarPlayer.tsx";

const GameTable: FC = () => {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const price = {5: 20, 6: 40, 7: 80, 8: 160}

    const toggleNumber = (number: number) => {
        if (selectedNumbers.includes(number)) {
            setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
        } else if (selectedNumbers.length < 8) {
            setSelectedNumbers([...selectedNumbers, number]);
        }
    }

    const calculatePrice = () => {
        const count = selectedNumbers.length;
        return price[count] || 0
    }

    const handleSubmit = () => {
        if (selectedNumbers.length < 5 || selectedNumbers.length > 8) {
            alert("Please select between 5 and 8 numbers."); // Потом поменять на нормальную ошибку
            return
        }
        alert(`Selected numbers: ${selectedNumbers.join(", ")}. Price: ${calculatePrice()}`);
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-600 relative text-white">
            <NavBarPlayer/>


            <div>
                <h2 className={"text-3xl font-bold text-white mb-6 text-center"}>Select your Numbers</h2>
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                    {Array.from({length: 16}, (_, index) => index + 1).map((number) => (
                        <button key={number} onClick={() => toggleNumber(number)}
                                className={`p-4 rounded-lg font-bold text-white text-lg transition-all 
                            ${selectedNumbers.includes(number)
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : "bg-gray-300 hover:bg-gray-400"}`}>
                            {number}
                        </button>
                    ))}
                </div>
                <div className={'text-center mt-8'}>
                    <p className="text-xl font-bold text-white">Price: {calculatePrice()}</p>
                    <button onClick={handleSubmit}
                            className={'mt-4 px-6 py-2 bg-yellow-300 hover:bg-amber-400 text-white font-bold rounded-lg shadow-md'}>confirm
                    </button>
                </div>
            </div>
             
            <div className="container mx-auto py-10 text-white text-center z-10">
                <h1 className='text-3x1 font-bold'>Welcome to Dead Pigeons</h1>
                <p className='mt-4'>Choose an option from the navbar </p>
            </div>
        </div>
    );
};

            export default GameTable;