import { useEffect, useMemo, useState } from "react";
import Jumbotron from "../components/Jumbotron";
import SearchBar from "../components/SearchBar";
import ArchetypeList from "../components/ArchetypeList";
import DeckList from "../components/DeckList";
import Loading from "../components/Loading";
import Error from "../components/Error";
import PaginationBar from "../components/PaginationBar";
import useFetchData from "../hooks/useFetchData";
import UploadDeck from "../components/UploadDeck";
import { useAuth } from "../contexts/AuthContext";
import SortingDecks from "../components/SortingDecks";
import instance from "../utils/axios/instance";

export default function TopDecks() {
  const [archetypes, setArchetypes] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [secondArchetypes, setSecondArchetypes] = useState([]);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setisError] = useState(null);
  const [page, setPage] = useState(1);
  const { user, token } = useAuth();

  // To avoid throwing an error when page is reloaded
  const {
    data: archetypeDecks,
    meta,
    loading,
    error,
  } = useFetchData(
    selectedArchetypeId !== null
      ? `/archetypes/${selectedArchetypeId}/decks`
      : `/decks?page=${page}${sort ? `&sort=${sort}` : ""}`
  );

  // Only executed one time only when page is reloaded
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const archetypesResponse = await instance.get(`/archetypes`);

        setArchetypes(archetypesResponse.data.data);
        setSecondArchetypes(archetypesResponse.data.data);
      } catch (error) {
        setisError(error.response.status);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredArchetypes = useMemo(() => {
    if (!query) {
      return secondArchetypes;
    }
    return secondArchetypes.filter((archetype) =>
      archetype.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [secondArchetypes, query]);

  const handlerArchetype = (id) => {
    isOpen
      ? setSecondArchetypes(archetypes)
      : setSecondArchetypes(
          archetypes.filter((archetype) => archetype.id === id)
        );
    isOpen ? setSelectedArchetypeId(null) : setSelectedArchetypeId(id);
    handlerToggle();
  };

  const handlerToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
      <Jumbotron
        title="Top Decks"
        text="Welcome to the world of challenge and strategy, where skill in playing Yu-Gi-Oh! cards reigns supreme. Dive into
          the thrill and unmatched intelligence with Top Decks Yu-Gi-Oh! Get the latest insights on the meta game, top
          strategies, and winning card combinations from leading experts. Join a dynamic community and compete for the title
          of the best. Explore the world of Top Decks Yu-Gi-Oh! with us!"
      >
        <UploadDeck user={user} token={token} />
      </Jumbotron>
      <br />
      <div className="text-dark">
        <title>Cavalry : Top Decks</title>

        <SearchBar name="Search: " value={query} onQueryChange={setQuery} />
        <div className="row">
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <Error code={isError.status} />
          ) : (
            filteredArchetypes.map((card, index) =>
              card.totalDecks < 1 ? null : (
                <ArchetypeList
                  key={index}
                  index={index}
                  isOpen={isOpen}
                  onArchetypeClick={handlerArchetype}
                  card={card}
                />
              )
            )
          )}
        </div>
        <SortingDecks sort={sort} onSortChange={setSort} />
        <div className="row  g-4 py-5">
          {loading ? (
            <Loading />
          ) : error ? (
            <Error code={error} />
          ) : isOpen ? (
            archetypeDecks.map((deck) => <DeckList key={deck.id} deck={deck} />)
          ) : (
            archetypeDecks.map((deck) => <DeckList key={deck.id} deck={deck} />)
          )}
        </div>
        {meta.totalPage > 1 && (
          <PaginationBar
            totalPages={meta.totalPage}
            currentPage={meta.currentPage}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
