import SectionPage from "../components/SectionPage";

const pageData = {
    eyebrow: "Overview",
    title: "Executive operations overview",
    description: "Monitor onboarding momentum, service reliability, billing exposure, and platform governance from one operational command surface.",
    stats: [
        { label: "Active clients", value: "128", meta: "+12 this month" },
        { label: "Open approvals", value: "09", meta: "3 require review today" },
        { label: "Escalations", value: "04", meta: "1 marked urgent" },
        { label: "Billing health", value: "98%", meta: "Collections on track" },
    ],
    highlights: [
        { title: "Priority onboarding queue", text: "Three enterprise client setups are waiting for final documentation verification.", status: "Review" },
        { title: "Renewal watchlist", text: "Two multi-account clients reach renewal window within the next 72 hours.", status: "Monitor" },
        { title: "Support pressure", text: "Escalation volume remains low, with only one issue breaching the service target.", status: "Stable" },
    ],
    tableTitle: "Recent operational updates",
    rows: [
        { name: "Northbridge Retail Group", status: "Approval pending", owner: "A. Sharma" },
        { name: "Craftline Distribution", status: "Billing synced", owner: "M. Iqbal" },
        { name: "UrbanNest Commerce", status: "Escalation resolved", owner: "S. Khan" },
    ],
};

function SuperDashboard() {
    return <SectionPage {...pageData} />;
}

export default SuperDashboard;