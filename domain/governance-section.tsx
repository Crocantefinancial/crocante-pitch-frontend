import { Shield, Info, Plus } from 'lucide-react'
import { useState } from "react"

const TABS = ["General Policies", "Crocante Wallet Policies", "Counterparty Policies", "Approval Groups", "Activity"]

const GOVERNANCE_RULES = [
  {
    name: "Approval Group Management",
    activity: "Create Approval Group, Edit Approval Group, Remove Approval Group",
    quorum: "Master Group (1)",
  },
  {
    name: "Fiat Transfer",
    activity: "New Fiat Transfer",
    quorum: "Master Group (1)",
  },
  {
    name: "Transaction Policy Management",
    activity: "Edit Counterparty Policy, Edit Custody Policy",
    quorum: "Master Group (2)",
  },
  {
    name: "Whitelist",
    activity: "New Whitelist Address",
    quorum: "Master Group (2)",
  },
]

const WALLET_POLICIES = [
  {
    order: "1",
    name: "sol 2",
    initiator: "All Initiators",
    destination: "All Destinations",
    asset: "SOL",
    assetIcon: "⬡",
    range: "0 USD or higher (Equivalent in USD)",
    quorum: "Master Group (1)\nTeste de Grupo (edit name) (1)",
  },
  {
    order: "2",
    name: "Policy BTC1",
    initiator: "All Initiators",
    destination: "All Destinations",
    asset: "BTC",
    assetIcon: "₿",
    range: "0 to 20 USD (Equivalent in USD)",
    quorum: "Master Group (2)",
  },
  {
    order: "3",
    name: "Policy BTC - 15-30",
    initiator: "All Initiators",
    destination: "All Destinations",
    asset: "BTC",
    assetIcon: "₿",
    range: "15 to 30 USD (Equivalent in USD)",
    quorum: "Master Group (2)",
  },
  {
    order: "4",
    name: "Policy Matic",
    initiator: "All Initiators",
    destination: "All Destinations",
    asset: "MATIC",
    assetIcon: "⬢",
    range: "0 to 20 USD (Equivalent in USD)",
    quorum: "Master Group (2)",
  },
]

const COUNTERPARTY_POLICIES = [
  {
    order: "1",
    name: "Policy All",
    initiator: "Admin",
    origin: "Exchange",
    destination: "Parfin Wallet",
    asset: "All Assets",
    range: "0 USD or higher (Equivalent in USD)",
    quorum: "Master Group (2)",
  },
  {
    order: "2",
    name: "iOTC Crypto Withdrawal Cypress Test CreateiOTCToWhitelistPolic...",
    initiator: "All Initiators",
    origin: "Internal OTC",
    destination: "Whitelist",
    asset: "All Assets",
    range: "0 or higher (Quantity)",
    quorum: "Master Group (2)",
  },
  {
    order: "3",
    name: "iOTC ALL",
    initiator: "All Initiators",
    origin: "Internal OTC",
    destination: "All Destinations",
    asset: "All Assets",
    range: "0 USD or higher (Equivalent in USD)",
    quorum: "Master Group (1)",
  },
]

const APPROVAL_GROUPS = [
  {
    name: "Master Group",
    members: "23 Users",
    lastUpdate: "Mar 06, 2024",
    rules: "27",
    status: "Active",
  },
  {
    name: "OPs Team",
    members: "6 Users",
    lastUpdate: "Oct 25, 2023",
    rules: "0",
    status: "Active",
  },
  {
    name: "Teste de Grupo (edit name)",
    members: "20 Users",
    lastUpdate: "Jan 09, 2024",
    rules: "2",
    status: "Active",
  },
  {
    name: "Tester",
    members: "5 Users",
    lastUpdate: "Nov 28, 2023",
    rules: "1",
    status: "Active",
  },
]

export function GovernanceSection() {
  const [activeTab, setActiveTab] = useState("General Policies")

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-semibold text-neutral-900">Governance</h2>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-neutral-200">
          <div className="flex gap-8 px-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-normal relative transition-colors ${
                  activeTab === tab ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === "Crocante Wallet Policies" ? (
            // Crocante Wallet Policies View
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 text-sm text-neutral-500 flex-1">
                  <p className="font-normal text-neutral-700">
                    Manage transaction policies regarding withdrawals from Crocante Wallets:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Transactions that don't match any of the following policies will be denied by default</li>
                    <li>A transaction will be evaluated by the first policy on the priority order that it matches.</li>
                    <li>Any changes to the policies will require approval</li>
                  </ul>
                </div>
                <button className="ml-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap">
                  Edit Policies
                </button>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Crocante Wallet Policies</h3>
                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Policy History
                </button>
              </div>

              {/* Wallet Policies Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[0.5fr,1.5fr,1.5fr,1.5fr,1.5fr,2fr,2fr] gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                  <div className="text-sm font-normal text-neutral-600"></div>
                  <div className="text-sm font-normal text-neutral-600">Order Name</div>
                  <div className="text-sm font-normal text-neutral-600">Initiator</div>
                  <div className="text-sm font-normal text-neutral-600">Destination</div>
                  <div className="text-sm font-normal text-neutral-600">Asset</div>
                  <div className="text-sm font-normal text-neutral-600">Range</div>
                  <div className="text-sm font-normal text-neutral-600">Quorum</div>
                </div>

                {/* Table Rows */}
                {WALLET_POLICIES.map((policy, index) => (
                  <div
                    key={policy.order}
                    className={`grid grid-cols-[0.5fr,1.5fr,1.5fr,1.5fr,1.5fr,2fr,2fr] gap-4 px-6 py-4 items-center ${
                      index < WALLET_POLICIES.length - 1 ? "border-b border-neutral-200" : ""
                    }`}
                  >
                    <div className="text-sm text-neutral-600">{policy.order}</div>
                    <div className="text-sm text-neutral-600">{policy.name}</div>
                    <div className="text-sm text-neutral-600">{policy.initiator}</div>
                    <div className="text-sm text-neutral-600">{policy.destination}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{policy.assetIcon}</span>
                      <span className="text-sm text-neutral-600">{policy.asset}</span>
                    </div>
                    <div className="text-sm text-neutral-600 leading-tight">{policy.range}</div>
                    <div className="text-sm text-neutral-600 leading-tight whitespace-pre-line">{policy.quorum}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "Counterparty Policies" ? (
            // Counterparty Policies View
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 text-sm text-neutral-500 flex-1">
                  <p className="font-normal text-neutral-700">
                    Manage transaction policies regarding withdrawals from Counterparties:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Transactions that don't match any of the following policies will be denied by default.</li>
                    <li>A transaction will be evaluated by the first policy on the priority order that it matches.</li>
                    <li>Any changes to the policies will require approval.</li>
                  </ul>
                </div>
                <button className="ml-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap">
                  Edit Policies
                </button>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Counterparty Policies</h3>
                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Policy History
                </button>
              </div>

              {/* Counterparty Policies Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[0.5fr,2fr,1.5fr,1.5fr,1.5fr,1.5fr,2fr,1.5fr] gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                  <div className="text-sm font-normal text-neutral-600"></div>
                  <div className="text-sm font-normal text-neutral-600">Order Name</div>
                  <div className="text-sm font-normal text-neutral-600">Initiator</div>
                  <div className="text-sm font-normal text-neutral-600">Origin</div>
                  <div className="text-sm font-normal text-neutral-600">Destination</div>
                  <div className="text-sm font-normal text-neutral-600">Asset</div>
                  <div className="text-sm font-normal text-neutral-600">Range</div>
                  <div className="text-sm font-normal text-neutral-600">Quorum</div>
                </div>

                {/* Table Rows */}
                {COUNTERPARTY_POLICIES.map((policy, index) => (
                  <div
                    key={policy.order}
                    className={`grid grid-cols-[0.5fr,2fr,1.5fr,1.5fr,1.5fr,1.5fr,2fr,1.5fr] gap-4 px-6 py-4 items-center ${
                      index < COUNTERPARTY_POLICIES.length - 1 ? "border-b border-neutral-200" : ""
                    }`}
                  >
                    <div className="text-sm text-neutral-600">{policy.order}</div>
                    <div className="text-sm text-neutral-600 truncate" title={policy.name}>{policy.name}</div>
                    <div className="text-sm text-neutral-600">{policy.initiator}</div>
                    <div className="text-sm text-neutral-600">{policy.origin}</div>
                    <div className="text-sm text-neutral-600">{policy.destination}</div>
                    <div className="text-sm text-neutral-600">{policy.asset}</div>
                    <div className="text-sm text-neutral-600 leading-tight">{policy.range}</div>
                    <div className="text-sm text-neutral-600">{policy.quorum}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "Approval Groups" ? (
            // Approval Groups View
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 text-sm text-neutral-500 flex-1">
                  <p className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Manage user groups that are responsible for approving the different activities across the platform that
                      require an approval workflow.
                    </span>
                  </p>
                  <p>
                    Only admins are allowed to create, edit, or remove groups. For your security, any changes must be
                    approved by: –
                  </p>
                </div>
                <button className="ml-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Group
                </button>
              </div>

              <h3 className="text-lg font-semibold text-neutral-900">Approval Groups</h3>

              {/* Approval Groups Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[2.5fr,1.5fr,1.5fr,1fr,1fr] gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                  <div className="text-sm font-normal text-neutral-600">Name</div>
                  <div className="text-sm font-normal text-neutral-600">Members</div>
                  <div className="text-sm font-normal text-neutral-600">Last Update</div>
                  <div className="text-sm font-normal text-neutral-600">Rules</div>
                  <div className="text-sm font-normal text-neutral-600">Status</div>
                </div>

                {/* Table Rows */}
                {APPROVAL_GROUPS.map((group, index) => (
                  <div
                    key={group.name}
                    className={`grid grid-cols-[2.5fr,1.5fr,1.5fr,1fr,1fr] gap-4 px-6 py-4 items-center ${
                      index < APPROVAL_GROUPS.length - 1 ? "border-b border-neutral-200" : ""
                    }`}
                  >
                    <div className="text-sm text-neutral-600">{group.name}</div>
                    <div className="text-sm text-neutral-600">{group.members}</div>
                    <div className="text-sm text-neutral-600">{group.lastUpdate}</div>
                    <div className="text-sm text-neutral-600">{group.rules}</div>
                    <div className="text-sm text-neutral-600">{group.status}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // General Policies View (default)
            <>
              <div className="space-y-3 mb-8 text-sm text-neutral-500">
                <p>Here you can view the main system policies.</p>
                <p>Changes on the approval quorum of the rules below need to be reviewed by our team</p>
                <p>
                  If you wish to change any of the approval quorum below,{" "}
                  <button className="text-primary hover:underline">click here</button> to open a request with us.
                </p>
              </div>

              {/* Rules Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-900">Rules</h3>

                {/* Table */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[2fr,3fr,1.5fr] gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                    <div className="text-sm font-normal text-neutral-600">Name</div>
                    <div className="text-sm font-normal text-neutral-600">Activity</div>
                    <div className="text-sm font-normal text-neutral-600 flex items-center gap-1">
                      Quorum
                      <Info className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Table Rows */}
                  {GOVERNANCE_RULES.map((rule, index) => (
                    <div
                      key={rule.name}
                      className={`grid grid-cols-[2fr,3fr,1.5fr] gap-4 px-6 py-4 ${
                        index < GOVERNANCE_RULES.length - 1 ? "border-b border-neutral-200" : ""
                      }`}
                    >
                      <div className="text-sm text-neutral-600">{rule.name}</div>
                      <div className="text-sm text-neutral-600">{rule.activity}</div>
                      <div className="text-sm text-neutral-600">{rule.quorum}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
