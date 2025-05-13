import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './searchBar.css'

const SearchBar = ({ onSearch, onClearSearch, value }) => {
    const [name, setName] = useState(value || "");
    const [debouncedName, setDebouncedName] = useState(name)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(name)
        }, 300)
        return () => clearTimeout(timer)
    }, [name])

    useEffect(() => {
        if (debouncedName.trim() !== "") {
            onSearch(debouncedName);
        } else {
            onClearSearch();
        }
    }, [debouncedName, onSearch, onClearSearch])

    const handleChange = (event) => {
        setName(event.target.value);
    };

    const handleSearch = () => {
        if (name.trim() !== "") {
            onSearch(name);
        }
    };

    return (
        <div className="div-search">
            <input
                type="search"
                onChange={handleChange}
                value={name}
                placeholder="Buscar productos..."
            />
            <button className="lupa" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    );
}

export default SearchBar;