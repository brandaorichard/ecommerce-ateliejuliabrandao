import mastercardIcon from "../assets/icons/mastercard_payment_icon.png";
import visaIcon from "../assets/icons/visa_icon.png";
import amexIcon from "../assets/icons/americanexpress.png";
import eloIcon from "../assets/icons/elo_payment.png";
import hipercardIcon from "../assets/icons/hiper_card.png";
import pixIcon from "../assets/icons/pix_icon.png";
import boletoIcon from "../assets/icons/boleto-logo.png";

export default function PaymentMethods() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <img src={mastercardIcon} alt="Mastercard" className="h-7 w-auto" />
      <img src={visaIcon} alt="Visa" className="h-7 w-auto" />
      <img src={amexIcon} alt="American Express" className="h-7 w-auto" />
      <img src={eloIcon} alt="Elo" className="h-7 w-auto" />
      <img src={hipercardIcon} alt="Hipercard" className="h-7 w-auto" />
      <img src={pixIcon} alt="Pix" className="h-7 w-auto" />
      <img src={boletoIcon} alt="Boleto" className="h-7 w-auto bg-white rounded" />
    </div>
  );
}