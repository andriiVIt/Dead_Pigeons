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
        <div className={'pt-10'}>
            <div>
                <h2 className={"text-3xl font-bold text-white mb-6 text-center"}>Select your Numbers</h2>
                <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {Array.from({length: 16}, (_, index) => index + 1).map((number) => (
                        <button key={number} onClick={() => toggleNumber(number)}
                                className={`py-12 rounded-lg font-bold text-white text-3xl transition-all 
                            ${selectedNumbers.includes(number)
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : "bg-gray-300 hover:bg-gray-400"}`}>
                            {number}
                        </button>
                    ))}
                </div>
                <div className={'text-center mt-8'}>
                    <p className="text-4xl font-bold text-white">Price: {calculatePrice()}</p>
                    <button onClick={handleSubmit}
                            className={'mt-4 px-6 py-6 text-3xl bg-purple-500 hover:bg-purple-800 text-white font-bold rounded-lg shadow-md transition-all'}>confirm
                    </button>
                </div>
            </div>

        </div>
    );
};

export default GameTable;