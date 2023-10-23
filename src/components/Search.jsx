import { useRef } from "react"
import { useKey } from "../useKey";

export default function Search({query, setQuery}) {
    // creating the ref with initial value
    // we bound this with the input using ref prop and ref name
    const inputEl = useRef(null);

    // custom hook
    useKey('Enter', function() {
        if (document.activeElement === inputEl.current) return;

        // inputEl.current it's the actual <input /> DOM element
        inputEl.current.focus();
        setQuery("");
    });

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputEl}
        />
    )
}