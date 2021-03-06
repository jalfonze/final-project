import React, { useEffect, useState, useRef } from "react";
import axios from "./axios";

export default function Search() {
    useEffect(() => {
        // axios.get("/get-recipe").then((response) => {
        //     console.log(response.data);
        // });
    }, []);

    const clearInput = useRef();
    const clearBox = useRef();
    const clearBox1 = useRef();
    const clearBox2 = useRef();
    const clearBox3 = useRef();

    let [searchInput, setSearchInput] = useState("");
    const [foodItems, setFoodItems] = useState([]);
    let [filteredOptions, setFilteredOptions] = useState([]);
    let [modal, setModal] = useState(false);
    let [modalInfo, setModalInfo] = useState();

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const foodSearch = () => {
        console.log("click");
        console.log("SEARCH INPUT!", searchInput);
        let searches = {
            searched: searchInput,
            filteredArr: filteredOptions,
        };
        axios.post("/get-recipe", searches).then((response) => {
            console.log(response.data);
            setFoodItems(response.data);
        });
        searchInput = "";
        clearInput.current.value = "";
        clearBox.current.checked = false;
        clearBox1.current.checked = false;
        clearBox2.current.checked = false;
        clearBox3.current.checked = false;
    };

    const checkBoxClick = (e) => {
        // console.log(e.target.value);

        if (e.target.checked) {
            setFilteredOptions([...filteredOptions, e.target.value]);
        } else if (!e.target.checked) {
            setFilteredOptions(
                filteredOptions.filter((option) => option !== e.target.value)
            );
        }
    };

    const showModal = (num) => {
        // console.log("click");
        // console.log(num);
        setModal(true);
        console.log(foodItems[num].recipe);
        setModalInfo(foodItems[num].recipe);
    };

    const closeModal = () => {
        setModal(false);
    };

    console.log("FOOD ITEMS", foodItems);

    const addToFave = (e) => {
        e.preventDefault();
        // console.log(e.target.value);
        // console.log(foodItems[e.target.value].recipe);
        const { label, ingredientLines, healthLabels, image, url } = modalInfo;

        let foodInfo = {
            label: label,
            ingredientLines: ingredientLines,
            yield: modalInfo.yield,
            image: image,
            url: url,
            healthLabels: healthLabels,
        };
        axios.post("/add-to-fave", foodInfo).then((response) => {
            console.log(response.data);
        });
        closeModal();
    };
    // console.log("FOOD ITEMS", foodItems);

    return (
        <React.Fragment>
            <div className="search-title">
                <img src="/logo.png" width="250px"></img>
            </div>
            <div className="search-inputs">
                <input
                    ref={clearInput}
                    className="inputOne"
                    onChange={handleSearch}
                    type="text"
                    name="search"
                    placeholder="What do you want to cook?"
                ></input>
                <div className="checkboxes">
                    <input
                        ref={clearBox}
                        type="checkbox"
                        name="health"
                        value="peanut-free"
                        id="peanut-free"
                        onClick={checkBoxClick}
                    ></input>
                    <label>Peanut Free</label>
                    <input
                        ref={clearBox1}
                        type="checkbox"
                        name="health"
                        value="alcohol-free"
                        id="alcohol-free"
                        onClick={checkBoxClick}
                    ></input>
                    <label>Alcohol Free</label>
                    <input
                        ref={clearBox2}
                        type="checkbox"
                        name="health"
                        value="vegan"
                        id="vegan"
                        onClick={checkBoxClick}
                    ></input>
                    <label>Vegan</label>
                    <input
                        ref={clearBox3}
                        type="checkbox"
                        name="health"
                        value="vegetarian"
                        id="vegetarian"
                        onClick={checkBoxClick}
                    ></input>
                    <label>Vegetarian</label>
                </div>
                <button
                    className="searchbtn"
                    onClick={foodSearch}
                    type="submit"
                >
                    Search
                </button>
            </div>
            <div>
                <div className="search-items">
                    {(foodItems && foodItems.length == 0 && (
                        <h1>No Results</h1>
                    )) ||
                        (foodItems &&
                            foodItems.map((item, i) => {
                                return (
                                    <div key={i}>
                                        <img
                                            className="modal-img"
                                            onClick={() => showModal(i)}
                                            src={item.recipe.image}
                                        ></img>
                                        <h3 className="h3">
                                            {item.recipe.label}
                                        </h3>
                                    </div>
                                );
                            }))}
                    <div className="modal-parent">
                        {modal && modalInfo && (
                            <div className="modal">
                                <div className="modal-header">
                                    <h3>{modalInfo.label}</h3>
                                    <button onClick={addToFave}>
                                        <i className="fas fa-bookmark"></i>
                                    </button>
                                    <h2 onClick={closeModal}>
                                        <i className="fas fa-times"></i>
                                    </h2>
                                </div>
                                <div className="modal-section">
                                    <img
                                        src={modalInfo.image}
                                        width="150px"
                                    ></img>
                                    <div>
                                        <h3>Dietary information</h3>
                                        {modalInfo.healthLabels.map(
                                            (label, i) => {
                                                return <p key={i}>{label}</p>;
                                            }
                                        )}
                                    </div>
                                </div>
                                <div className="modal-main">
                                    <h3>Ingredients</h3>
                                    {modalInfo.ingredientLines.map(
                                        (ingredients, i) => {
                                            return <p key={i}>{ingredients}</p>;
                                        }
                                    )}
                                    <a
                                        href={modalInfo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Full recipe here!
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
