import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import useSWR from "swr";

import PageHead from "@/components/head";
import Navbar from "@/components/navbar";
import { DeckBody } from "@/types";
import styles from "@/styles/study.module.css";

export default function Home({ auth }: HomeProps) {
  const [createDeckPopUp, setCreateDeckPopUp] = useState<boolean>(false);
  const [addCardPopUp, setAddCardPopUp] = useState<boolean>(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { data, error } = useSWR(
    `/api/GET/decks?deck_owner=${user?.username}`,
    fetcher
  );
  //TODO: show total cards
  //TODO: make sure user.username exists
  return (
    <>
      <PageHead />
      <Navbar />
      <SignedIn>
        <main className={styles.container}>
          {createDeckPopUp && (
            <PostDeckForm
              setCreateDeckPopUp={setCreateDeckPopUp}
              userName={user?.username || ""}
            />
          )}
          {addCardPopUp && (
            <PostCardForm
              setAddCardPopUp={setAddCardPopUp}
              userName={user?.username || ""}
            />
          )}
          <h1>Hello {user?.username}!</h1>
          <h1>Decks</h1>
          <div className={styles.deck_container}>
            {data && renderDecks(data)}
          </div>
          <button
            onClick={(e) => {
              setCreateDeckPopUp(true);
            }}
          >
            Create Deck
          </button>
          <button
            onClick={(e) => {
              setAddCardPopUp(true);
            }}
          >
            Add Card
          </button>
        </main>
      </SignedIn>
      <SignedOut>
        <div>
          <Link href="/sign-in">sign-in</Link>
        </div>
        <div>
          <Link href="/sign-up">sign-up</Link>
        </div>
      </SignedOut>
    </>
  );
}

interface FlashcardDeckProps {
  title: string;
  totalCards: number;
  dueCards: number;
  newCards: number;
}

function FlashcardDeck({
  title,
  totalCards,
  dueCards,
  newCards,
}: FlashcardDeckProps) {
  //TODO: move router out (useContext)
  const router = useRouter();
  return (
    <div className={styles.flashcardDeck}>
      <h4 className={styles.deckTitle}>{title}</h4>
      <div className={styles.deckStatus}>
        <div className={styles.statusItem}>
          <span className={styles.total}>{totalCards}</span>
          <span>Total</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.due}>{dueCards}</span>
          <span>Due</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.new}>{newCards}</span>
          <span>New</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          router.push(`/review/${title}`);
        }}
        className={styles.reviewButton}
      >
        Review
      </button>
    </div>
  );
}

const fetcher = (args: string) => fetch(args).then((res) => res.json());

interface DeckData {
  deck_name: string;
  totalCards: number;
  dueCards: number;
  newCards: number;
}

interface HomeProps {
  auth: boolean | null;
}

function renderDecks(data: DeckData[]) {
  //TODO: make sure what happens if theres no number
  return data.map((e) => (
    <FlashcardDeck
      title={e.deck_name}
      totalCards={e.totalCards}
      dueCards={e.dueCards}
      newCards={e.totalCards}
      key={e.deck_name}
    />
  ));
}
function postDeck(deck_owner: string, deck_name: string) {
  fetch(`/api/POST/decks?deck_owner=${deck_owner}&deck_name=${deck_name}`);
}
//TODO: make into reusable component
function PostDeckForm({
  userName,
  setCreateDeckPopUp,
}: {
  setCreateDeckPopUp: any;
  userName: string;
}) {
  const [title, setTitle] = useState<string>("");
  return (
    <div className={styles.postForm}>
      <h2>Add Deck</h2>
      <div>
        <span>Title: </span>
        <input
          type="text"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <button
        onClick={(e) => {
          if (title !== "" && userName !== "") postDeck(userName, title);
          setCreateDeckPopUp(false);
        }}
      >
        Submit
      </button>
      <button
        onClick={(e) => {
          setCreateDeckPopUp(false);
        }}
      >
        Cancel
      </button>
    </div>
  );
}

function postCard(
  deckName: string,
  deckOwner: string,
  front: string,
  back: string
) {
  fetch(
    `/api/POST/cards?deckName=${deckName}&deckOwner=${deckOwner}&front=${front}&back=${back}`
  );
}
function PostCardForm({
  userName,
  setAddCardPopUp,
}: {
  userName: string;
  setAddCardPopUp: any;
}) {
  const [front, setFront] = useState<string>("");
  const [back, setBack] = useState<string>("");
  const [deckName, setDeckName] = useState<string>("");
  //TODO: change set deck name to dropdown
  return (
    <div className={styles.postForm}>
      <h2>Add Card</h2>
      <div>
        <span>Front: </span>
        <input
          type="text"
          onChange={(e) => {
            setFront(e.target.value);
          }}
        />
      </div>
      <div>
        <span>Back: </span>
        <input
          type="text"
          onChange={(e) => {
            setBack(e.target.value);
          }}
        />
      </div>
      <div>
        <span>Deck Name: </span>
        <input
          type="text"
          onChange={(e) => {
            setDeckName(e.target.value);
          }}
        />
      </div>
      <button
        onClick={() => {
          if (front != "" && back != "" && deckName != "") {
            console.log({ deckName, front, back });
            postCard(deckName, userName, front, back);
          }
          setAddCardPopUp(false);
        }}
      >
        Accept
      </button>
      <button
        onClick={() => {
          setAddCardPopUp(false);
        }}
      >
        Cancel
      </button>
    </div>
  );
}
