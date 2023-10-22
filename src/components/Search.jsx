import { useEffect, useRef } from "react"

export default function Search({query, setQuery}) {
    // creating the ref with initial value
    // we bound this with the input using ref prop and ref name
    const inputEl = useRef(null);

    // using the ref
    useEffect(function() {
        function callback(e) {
            // document.activeElement it's the currently active/focused element
            if (document.activeElement === inputEl.current) return;

            if (e.code === 'Enter') {
                // inputEl.current it's the actual <input /> DOM element
                inputEl.current.focus();
                setQuery("");
            }
        }

        document.addEventListener('keydown', callback);
        return () => document.addEventListener('keydown', callback);
    }, [setQuery]);

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