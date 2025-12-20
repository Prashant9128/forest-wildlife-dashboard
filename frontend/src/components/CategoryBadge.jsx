import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

export default function CategoryBadge({ status, size = "md" }) {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case "endangered":
                return {
                    color: "bg-red-500/20 text-red-300 border-red-500/30",
                    icon: FaExclamationTriangle,
                    label: "Endangered"
                };
            case "vulnerable":
                return {
                    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                    icon: FaInfoCircle,
                    label: "Vulnerable"
                };
            case "protected":
                return {
                    color: "bg-green-500/20 text-green-300 border-green-500/30",
                    icon: FaShieldAlt,
                    label: "Protected"
                };
            default:
                return {
                    color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
                    icon: FaCheckCircle,
                    label: status || "Unknown"
                };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    const sizeClasses = {
        sm: "px-2 py-0.5 text-xs gap-1",
        md: "px-3 py-1 text-xs gap-1.5",
        lg: "px-4 py-1.5 text-sm gap-2"
    };

    return (
        <span className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses[size]}`}>
            <Icon />
            {config.label}
        </span>
    );
}
