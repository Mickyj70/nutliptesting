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
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { LoginContext } from '../../../../context/Login.context';

const Process = () => {
  const [progress, setProgress] = useState(Math.floor(100 / 12));
  const count = useRef(1);
  const router = useRouter();
  const { id } = router.query;

  const [transaction, setTransaction] = useState(null);
  const [apartment, setApartment] = useState(null);
  const [transactionStage, setTransactionStage] = useState(null);
  const [sellerInfo, setSellerInfo] = useState([]);
  const [userType, setUserType] = useState(null);
  const {userInformation}= useContext(LoginContext);
  const [transactionContent, setTransactionContent]= useState()

  useEffect(()=>{
    const fetchData = async () => {
      const response = await fetch(`/api/transaction/gettxcontent/${id}`);
      const data = await response.json();
      setTransactionContent(data.transactioncontent);
      console.log("TRANSACTION CONTENT",transactionContent);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Ensure id is available before making the fetch call
  
      try {
        const transactionResponse = await fetch(`/api/transaction/${id}`);
        const transactionData = await transactionResponse.json();
        console.log("API response:", transactionData);
        setTransaction(transactionData.transaction);
        setTransactionStage(transactionData.transaction.transactionCurrentStage); // Set the transaction stage
  
        if (transactionResponse.ok) {
          const apartmentResponse = await fetch(`/api/apartment/${transactionData.transaction.ApartmentId}`);
          const apartmentData = await apartmentResponse.json();
          console.log("Apartment API response:", apartmentData);
          setApartment(apartmentData);
  
          const sellerResponse = await fetch(`/api/user/${userInformation.user.id}`);
          const sellerData = await sellerResponse.json();
          console.log("USER INFO", sellerData);
          setSellerInfo(sellerData);
          setUserType(sellerData.userType.type)

        } else {
          console.error("API error:", transactionData.message);
        }
        
      } catch (error) {
        console.error("API error:", error);
      }
    };
  
    fetchData();

    console.log(userType)

  }, [id]);




  useEffect(() => {
    if (transactionStage !== null) {
      setProgress((transactionStage / 12) * 100);
    }
  }, [transactionStage]);

  return (
    <div className={styles.Section}>
      <div className={styles.container}>
        {transactionStage !== 11 && <Chat position="fixed" top="90%" right={20} />}

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
                <span style={{ textTransform: "Capitalize" }}>Transaction ID:</span>)
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
        {transactionStage === 1 && <Offer id={id} userType={userType} transaction={transaction} apartment={apartment} sellerInfo={sellerInfo}/>}
        {transactionStage === 2 && <Funds id={id} userType={userType} transaction={transaction} apartment={apartment} transactionContent={transactionContent}/>}
      {transactionStage === 3 && <AddConveyancer userType={userType} transaction={transaction} apartment={apartment} userInformation={userInformation}/>}
        {transactionStage === 4 && <ResearchSurvey userType={userType} transaction={transaction} apartment={apartment}/>}
        {transactionStage === 5 && <Contract userType={userType} transaction={transaction} apartment={apartment}/>}
        {transactionStage === 6 && <NutlipCommission userType={userType} transaction={transaction} apartment={apartment}/>}
        {transactionStage === 7 && <Deposit userType={userType} transaction={transaction} apartment={apartment}/>}
        {transactionStage === 8 && <DOC userType={userType} transaction={transaction} apartment={apartment}/>}
        {transactionStage === 9 && <FullPayment userType={userType} transaction={transaction} apartment={apartment}/>}
        {transactionStage === 10 && <TransferTitle userType={userType} transaction={transaction} apartment={apartment}/>}
        {transactionStage === 11 && <Success userType={userType} transaction={transaction} apartment={apartment}/>}

        {transactionStage !== 11 && (
          <div id={styles.page_nav}>
            <button>
              Completed: <span>Offer Accepted</span>
            </button>
            <button>
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
      <Image src="/buyerprocess/success.png" alt="success" width={300} height={200} />
      <div className={styles.successText}>
        <h2>Congratulations</h2>
        <p>Transaction complete</p>
      </div>
    </div>
  );
};

export default Process;