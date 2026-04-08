import { Outlet } from "react-router-dom";
import styles from "./Journal.module.css";

export default function Journal() {
    return (
        <section className={styles.shell} aria-label="Journal workspace">
            <Outlet />
        </section>
    );
}