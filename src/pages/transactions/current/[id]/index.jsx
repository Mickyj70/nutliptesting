import {
  AddConveyancer,
  Contract,
  DOC,
  Deposit,
  FullPayment,
  Funds,
  FundsVerify,
  NutlipCommission,
  Offer,
  ResearchSurvey,
  TransferTitle,
} from "../../../../components/Buyer Process";
import { Chat } from "../../../../components/styled components/Chat";
import Progress_bar from "../../../../components/ProgressBar";
import Button from "../../../../components/styled components/Button";
import styles from "../../../../styles/Transactions/OfferProcess.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const Process = () => {
  const [progress, setProgress] = useState(Math.floor(100 / 12));
  const count = useRef(1);
  const router = useRouter();
  const { id } = router.query;

  const [transaction, setTransaction] = useState(null);
  const [apartment, setApartment] = useState(null);
  const [transactionStage, setTransactionStage] = useState(null);
  const [sellerInfo, setSellerInfo] = useState([]);

  const [userType, setUserType] = useState("agent");

  

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Ensure id is available before making the fetch call
  
      try {
        const transactionResponse = await fetch(`/api/transaction/${id}`);
        const transactionData = await transactionResponse.json();
        console.log("API response:", transactionData);
        setTransaction(transactionData.transaction);
        setTransactionStage(transactionData.transaction.transactionStage); // Set the transaction stage
  
        if (transactionResponse.ok) {
          const apartmentResponse = await fetch(`/api/apartment/${transactionData.transaction.ApartmentId}`);
          const apartmentData = await apartmentResponse.json();
          console.log("Apartment API response:", apartmentData);
          setApartment(apartmentData);
  
          const sellerResponse = await fetch(`/api/user/${transactionData.transaction.offer.sellerId}`);
          const sellerData = await sellerResponse.json();
          console.log("USER INFO", sellerData);
          setSellerInfo(sellerData);
        } else {
          console.error("API error:", transactionData.message);
        }
        
      } catch (error) {
        console.error("API error:", error);
      }
    };
  
    fetchData();
  }, [id]);




  const handleChange = () => {
    // Only allow progress if the transaction stage matches count.current
    // if (transactionStage === count.current && count.current <= 11) {
    //   setProgress(progress + Math.floor(100 / 12));
    //   count.current = count.current + 1;
    //   if (count.current === 12) setProgress(100);
    // } else {
    //   console.log('Cannot progress to the next stage until the current Transaction stage is completed.');
    // }

    setProgress(progress + Math.floor(100 / 12));
      count.current = count.current + 1;
  };

  return (
    <div className={styles.Section}>
      <div className={styles.container}>
        {count.current !== 12 && <Chat position="fixed" top="90%" right={20} />}

        <div id={styles.top_bar}>
          <div className={styles.rightSide}>
            <div className={styles.googlemeet}>
              <Image
                src="/logos_google-meet.svg"
                width={30}
                height={30}
                alt=""
              />
              <p>Google meet</p>
            </div>

            <li>Online (2)</li>

            <div className={styles.TransactionId}>
              <p style={{ textTransform: "uppercase" }}>
                <span style={{ textTransform: "Capitalize" }}>Transaction ID:</span> 
                {id && id?.slice(0, 8)}
              </p>
            </div>
          </div>

          <button className={styles.CancelTransaction}>
            Cancel <span>Transaction</span>
          </button>
        </div>

        <Progress_bar bgcolor="#001F6D" progress={progress} height={30} />

        {/* NOTE: Code to be refactored */}
        {count.current === 1 && <Offer id={id} userType={userType} transaction={transaction} apartment={apartment} sellerInfo={sellerInfo}/>}
        {count.current === 2 && <Funds id={id} userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 3 && <FundsVerify userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 4 && <AddConveyancer userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 5 && <ResearchSurvey userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 6 && <Contract userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 7 && <NutlipCommission userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 8 && <Deposit userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 9 && <DOC userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 10 && <FullPayment userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 11 && <TransferTitle userType={userType} transaction={transaction} apartment={apartment}/>}
        {count.current === 12 && <Success userType={userType} transaction={transaction} apartment={apartment}/>}

        {count.current !== 12 && (
          <div id={styles.page_nav}>
            <button>
              Completed: <span>Offer Accepted</span>
            </button>
            <button onClick={handleChange}>
              Next : <span>Funds Verification</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Success = () => {
  return (
    <div className={styles.offer} id={styles.success}>
      <img src="/buyerprocess/success.png" alt="success" />
      <div className={styles.successText}>
        <h2>Congratulations</h2>
        <p>Transaction complete</p>
      </div>
    </div>
  );
};

export default Process;
