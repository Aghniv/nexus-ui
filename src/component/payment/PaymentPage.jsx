import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import PaymentFallback from "./PaymentFallback";
import ApiService from "../../service/ApiService";


const PaymentPage = () => {
    const {bookingReference, amount} = useParams()
    const [clientSecret, setClientSecret] = useState(null)
    const [error, setError] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(null)
    const navigate = useNavigate();

    useEffect(()=> {
        const fetchClientSecrete = async () => {
            try {
                const paymentData = {bookingReference, amount};
                console.log("BOOKING NO IS: " + bookingReference)
                console.log("Amount  IS: " + amount)

                const uniquePaymentSecreet = await ApiService.proceedForPayment(paymentData);
                console.log("UNIQUE CLIENT SECRETE FROM fetchClientSecrete is: " + uniquePaymentSecreet);
                setClientSecret(uniquePaymentSecreet);
            } catch (error) {
                console.log(error)
                // Handle different types of errors
                if (error.message.includes('server is not responding')) {
                    setError('Payment server is temporarily unavailable. Please try again in a few moments.');
                } else if (error.message.includes('server error')) {
                    setError('Payment server error. Please contact support if the issue persists.');
                } else {
                    setError(error.message || 'An unexpected error occurred. Please try again.');
                }
            }
        };
        fetchClientSecrete();
    }, [bookingReference, amount])



    if (error) {
        // Show fallback UI for backend connection issues
        if (error.includes('server is not responding') || error.includes('temporarily unavailable')) {
            return (
                <PaymentFallback 
                    bookingReference={bookingReference}
                    amount={amount}
                    onRetry={() => {
                        setError(null);
                        // Retry the payment intent fetch
                        const fetchClientSecrete = async () => {
                            try {
                                const paymentData = {bookingReference, amount};
                                const uniquePaymentSecreet = await ApiService.proceedForPayment(paymentData);
                                setClientSecret(uniquePaymentSecreet);
                            } catch (error) {
                                console.log(error);
                                if (error.message.includes('server is not responding')) {
                                    setError('Payment server is temporarily unavailable. Please try again in a few moments.');
                                } else {
                                    setError(error.message || 'An unexpected error occurred. Please try again.');
                                }
                            }
                        };
                        fetchClientSecrete();
                    }}
                />
            );
        }
        return <div className="error-message">{error}</div>
    }

    //initilize strip with public key
    const stripePromise = loadStripe(
        "pk_test_51T2v7jBy5DsFCE5hui706jLELXr5omXXyOPqTakCdAybF8JYZpg8pTv9lCRWycAnZloQNhs3TeVkCgk2HBJJ0SB500apOKJHlL"
    );

    //du tion to ipdate payment status for our booking in our backend databse
    const handlePaymentStatus = async (paymentStatus, transactionId = "", failureReason = "") => {
        try {

            const paymentData = {
                bookingReference,
                amount,
                transactionId,
                success: paymentStatus === "succeeded",
                failureReason
            }
            
            await ApiService.updateBookingPaymeent(paymentData)
            console.log("Payment sataus weas updated")
        } catch (error) {
            console.log(error.message)
        }
    }

    return(
        <div className="payment-page">
            <Elements stripe={stripePromise} options={clientSecret}>
                <PaymentForm
                    clientSecrete={clientSecret}
                    amount={amount}
                    onPaymentSuccess={(transactionId) => {
                        setPaymentStatus("succeeded")
                        handlePaymentStatus("succeeded", transactionId)
                        navigate(`/payment-success/${bookingReference}`)
                    }}
                    onPaymentError={(error) => {
                        setPaymentStatus("failed");
                        handlePaymentStatus("failed", "", error.message)
                        navigate(`/payment-failed/${bookingReference}`);
                    }}
                />
            </Elements>

            {paymentStatus && <div>Payment Status: {paymentStatus}</div>}
        </div>
    )

}

export default PaymentPage;
