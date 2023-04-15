import PageHead from "@/components/head";
import Navbar from "@/components/navbar";
import useSWR from "swr";
import styles from "@/styles/study.module.css";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useState } from "react";

const fetcher = (args: string) => fetch(args).then((res) => res.json());
const putCard = async (_id: string, rate: "good" | "bad") => {
  await fetch(`/api/PUT/cards?_id=${_id}&rate=${rate}`);
};
export default function Review() {
  //TODO: make server only send the current front card
  //and not send the back until 'Show Answer' has been clicked.
  const [reviewing, setReviewing] = useState<boolean>(false);
  const [reveal, setReveal] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const router = useRouter();
  const { deckName } = router.query;
  const { isLoaded, user } = useUser();
  const { data, error, isLoading } = useSWR(
    `/api/GET/cards?deckOwner=${user?.username}&deckName=${deckName}`,
    fetcher
  );
  let front = "";
  let back = "";
  let card_id = "";

  if (!isLoading) {
    front = data[current].front;
    back = data[current].back;
    card_id = data[current]._id;
  }
  //TODO add UI if signedout
  return (
    <>
      <PageHead />
      <Navbar />
      <SignedIn>
        <main className={styles.container}>
          <h1>Hello {user?.username}</h1>
          <h1>Reviewing {deckName}</h1>
          {!reviewing && (
            <>
              <DeckStats totalCards={0} dueCards={0} newCards={0} />
              <StartReviewing setReviewing={setReviewing} />
            </>
          )}
          {reviewing && !isLoading && (
            <>
              <h1>{front}</h1>
              <hr />
              {!reveal && (
                <button
                  onClick={() => {
                    setReveal(true);
                  }}
                >
                  Show Answer
                </button>
              )}
              {reveal && (
                <>
                  <h1>{back}</h1>
                  <hr />
                  <button
                    onClick={() => {
                      putCard(card_id, "good");
                    }}
                  >
                    Good
                  </button>
                  <button
                    onClick={() => {
                      putCard(card_id, "bad");
                    }}
                  >
                    Bad
                  </button>
                </>
              )}
            </>
          )}
        </main>
      </SignedIn>
    </>
  );
}
function StartReviewing({ setReviewing }: { setReviewing: any }) {
  return (
    <button
      onClick={() => {
        setReviewing(true);
      }}
    >
      Start Reviewing
    </button>
  );
}
function DeckStats({
  totalCards,
  dueCards,
  newCards,
}: {
  totalCards: number;
  dueCards: number;
  newCards: number;
}) {
  return (
    <div>
      <h4>Total Cards: {totalCards}</h4>
      <h4>Due Cards: {dueCards}</h4>
      <h4>New Cards: {newCards}</h4>
    </div>
  );
}
