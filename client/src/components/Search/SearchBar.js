import React, { useContext, useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { search } from "../../api/backend";
import { PeerContext } from "../../context/PeerContext";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const deb = useDebounce(q, 500);
  const { setSearchResults } = useContext(PeerContext);

  useEffect(() => {
    let mounted = true;
    if (!deb || deb.length < 1) {
      console.log("[SearchBar] Empty search query, clearing results");
      setSearchResults([]);
      return;
    }
    console.log("[SearchBar] Searching for:", deb);
    const result = search(deb);
    if (result && result.then) {
      result.then(res => {
        if (!mounted) return;
        console.log("[SearchBar] Search results received:", res);
        setSearchResults(res.data || []);
      }).catch(err => {
        console.error("[SearchBar] Search error:", err);
        console.error("[SearchBar] Error details:", err.response?.status, err.response?.data);
        setSearchResults([]);
      });
    } else {
      console.error("[SearchBar] search() did not return a promise:", result);
    }
    return () => { mounted = false; };
  }, [deb, setSearchResults]);

  return (
    <div className="search-bar">
      <input
        data-testid="search-input"
        className="search-input"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="🔎 Search files or keywords..."
      />
      <button className="search-button">Search</button>
    </div>
  );
}
