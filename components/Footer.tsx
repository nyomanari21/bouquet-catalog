export default function Footer() {
    return (
        <footer className="bg-[#e75888]/10 py-6 mt-auto">
            <div className="max-w-4xl mx-auto text-center text-[#e75888] text-sm">
                &copy; {new Date().getFullYear()} Bouquet by Dila. All rights reserved.
            </div>
        </footer>
    );
}