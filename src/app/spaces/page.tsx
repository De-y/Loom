import DashboardNavbar from "@/components/dashboard_nav"
import '@/css/spaces.css'
import SpacesInformation from '@/components/spaceInfo'
export default function space() {
    return (
        <>
            <DashboardNavbar />
            <div className="spaces">
                <div className="df">
                    <div className="sp">
                        <h1>Find classes for you to learn and grow.</h1>
                    </div>
                </div>
            </div>
            <div className="spaces-cards">
                <SpacesInformation />
            </div>
        </>
    )
}