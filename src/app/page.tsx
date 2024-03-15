import logo from "./images/logo.png";
import Image from "next/image";
import CoinDataTable from "./components/CoinDataTable";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gradient-background">
      <div className="z-10 max-w-full w-full items-center justify-between font-mono text-sm lg:flex p-2.5">
        <div className="flex items-center">
          <Image src={logo} width={84} height={84} alt="Logo" />
          <p className="headertext pl-2.5">The All-Seeing Eye</p>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none rounded-lg p-[8px] border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 shadow-md">
          <a
            href="https://twitter.com/relaxedbobo"
            rel="noopener noreferrer"
            target="_blank"
            className="twitter"
            aria-label="Twitter"
          >
            <div className="icon">
              <div className="kit-icon is-fill">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3402 8.23421C19.3515 8.39695 19.3515 8.55969 19.3515 8.72393C19.3515 13.7284 15.5417 19.5 8.5754 19.5V19.497C6.51753 19.5 4.50241 18.9105 2.77002 17.7991C3.06925 17.8351 3.36998 17.8531 3.67146 17.8539C5.37686 17.8554 7.0335 17.2831 8.37517 16.2295C6.75452 16.1987 5.33336 15.142 4.83689 13.5994C5.4046 13.7089 5.98957 13.6864 6.54678 13.5341C4.77989 13.1771 3.50872 11.6247 3.50872 9.82186C3.50872 9.80536 3.50872 9.78961 3.50872 9.77386C4.03519 10.0671 4.62465 10.2298 5.22761 10.2478C3.56347 9.13565 3.0505 6.92179 4.05544 5.1909C5.97832 7.557 8.81539 8.99541 11.8609 9.14765C11.5557 7.83224 11.9727 6.45382 12.9566 5.52913C14.482 4.09522 16.8811 4.16872 18.315 5.69337C19.1632 5.52613 19.9762 5.2149 20.7201 4.77393C20.4374 5.65062 19.8457 6.39533 19.0552 6.86855C19.8059 6.78005 20.5394 6.57907 21.2301 6.27234C20.7216 7.03429 20.0812 7.698 19.3402 8.23421Z"
                    fill="white"
                  ></path>
                </svg>
              </div>
            </div>
          </a>
        </div>
   
      </div>
      <CoinDataTable />
      <div className="mb-32">
     <p> &ldquo;When you genuinely accept the risks, you will be at peace with any outcome. &rdquo;  Mark Douglas </p>
      </div>
    </main>
  );
}
