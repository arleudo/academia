import { PaymentDialog } from "./PaymentDialog"
import { PaymentsTable } from "./PaymentsTable"

export function Payments() {
    return (
        <div className="container mx-auto py-10 mt-14">
            <PaymentsTable />
            <PaymentDialog/>
        </div>
    )
}
