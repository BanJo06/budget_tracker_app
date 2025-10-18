import type {
  Account,
  PlannedBudget,
  PlannedBudgetTransaction,
} from "@/types/types";
import { getAccounts } from "@/utils/accounts";
import {
  getAllPlannedBudgetTransactions,
  getPlannedBudgets,
  initDatabase,
  savePlannedBudgetTransaction,
} from "@/utils/database";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SVG_ICONS } from "../../../assets/constants/icons";
import PlannedBudgetModals from "../../../components/PlannedBudgetModals";
import ProgressBar from "../../../components/ProgressBar";
import ProgressRing from "../../../components/ProgressRing";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";
import type { TabHomeScreenNavigationProp } from "../../../types";

// =========================================================
// 🟣 Main Screen (logic fixes applied)
// =========================================================
export default function Index() {
  const navigation = useNavigation<TabHomeScreenNavigationProp>();
  const router = useRouter();

  const [plannedBudgets, setPlannedBudgets] = useState<PlannedBudget[]>([]);
  const [budgetTransactions, setBudgetTransactions] = useState<
    PlannedBudgetTransaction[]
  >([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // FIX: Added currentProgress state as a placeholder
  const [currentProgress, setCurrentProgress] = useState(0);

  const [selectedBudget, setSelectedBudget] = useState<PlannedBudget | null>(
    null
  );
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [isAccountsModalVisible, setAccountsModalVisible] = useState(false);

  const [transactionAmount, setTransactionAmount] = useState("");

  // 🧩 Initialize DB + load accounts
  useEffect(() => {
    async function setupDatabaseAndLoadAccounts() {
      try {
        await initDatabase();
        const initialAccounts = await getAccounts();
        setAccounts(initialAccounts);
        setDbReady(true);
        // FIX: Set placeholder progress value to prevent crash
        setCurrentProgress(0.5);
      } catch (error) {
        console.error(
          "Error initializing database or loading accounts:",
          error
        );
      }
    }
    setupDatabaseAndLoadAccounts();
  }, []);

  const toggleAccountsModal = () => setAccountsModalVisible((p) => !p);

  // Load all transactions (global)
  const loadAllTransactions = async () => {
    try {
      const all = await getAllPlannedBudgetTransactions();
      const sorted = all.sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      console.log("🧾 [DEBUG] All transactions loaded:", sorted);
      setBudgetTransactions(sorted);
    } catch (err) {
      console.error("❌ [DEBUG] Error loading all transactions:", err);
    }
  };

  // Load planned budgets
  const loadPlannedBudgets = useCallback(async () => {
    try {
      setLoading(true);
      await initDatabase();
      const budgets = await getPlannedBudgets();
      setPlannedBudgets(budgets);
    } catch (error) {
      console.error("Error loading planned budgets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlannedBudgets();
  }, [loadPlannedBudgets]);

  useFocusEffect(
    useCallback(() => {
      loadPlannedBudgets();
      loadAllTransactions();
    }, [loadPlannedBudgets])
  );

  // Also load all transactions once when component mounts (fallback)
  useEffect(() => {
    loadAllTransactions();
  }, []);

  // ---------- Progress calculation ----------
  // tolerant key check: some DB rows might use planned_budget_id or budget_id
  const getPlannedBudgetId = (t: any) =>
    t.planned_budget_id ?? t.budget_id ?? t.plannedBudgetId ?? null;

  // This function seems unused in the UI, but kept for reference
  const calculateProgress = (budget: any, allTransactions: any[]) => {
    if (!budget || !allTransactions) {
      console.log("⚠️ [DEBUG] Missing budget or transactions input");
      return 0;
    }

    const transactions = allTransactions.filter(
      (t) => getPlannedBudgetId(t) === budget.id
    );

    console.log(
      `🧮 [DEBUG] Budget "${budget.budget_name}" (${budget.id}) has`,
      transactions.length,
      "transactions"
    );

    if (!transactions || transactions.length === 0) {
      console.log("ℹ️ [DEBUG] No transactions for this budget yet");
      return 0;
    }

    const totalSaved = transactions.reduce(
      (sum, t) => sum + parseFloat(t.amount || 0),
      0
    );
    const goal = parseFloat(budget.amount || 0);
    const progress = goal > 0 ? Math.min(totalSaved / goal, 1) : 0;

    console.log(
      `💰 [DEBUG] Total Saved = ₱${totalSaved.toFixed(
        2
      )} / Goal = ₱${goal.toFixed(2)} → Progress = ${(progress * 100).toFixed(
        2
      )}%`
    );

    return progress;
  };

  // FIX: Simplified and corrected the redundant getProgress logic
  const getProgress = (
    budget: PlannedBudget,
    transactions: PlannedBudgetTransaction[]
  ): number => {
    if (!budget) return 0;
    const budgetAmount = Number(budget.amount || 0);
    if (budgetAmount === 0) return 0;

    const spentAmount = transactions
      .filter((t) => t.planned_budget_id === budget.id)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const progress = spentAmount / budgetAmount;

    // Return progress as a number between 0 and 1 (clamped)
    return progress > 1 ? 1 : progress;
  };

  // ---------- Save transaction ----------
  useEffect(() => {
    if (selectedBudget?.id) {
      const transactions = budgetTransactions.filter(
        (t) => getPlannedBudgetId(t) === selectedBudget.id
      );
      console.log("✅ [DEBUG] All transactions:", budgetTransactions);
      console.log("✅ [DEBUG] Filtered for selected:", transactions);
    }
  }, [selectedBudget, budgetTransactions]);

  const handleSaveTransaction = async () => {
    if (!transactionAmount) {
      alert("Please enter an amount.");
      return;
    }
    if (!selectedBudget) {
      alert("No planned budget selected.");
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      await savePlannedBudgetTransaction(
        selectedBudget.id,
        Number(transactionAmount),
        currentDate,
        selectedAccount?.id ?? null
      );

      setTransactionAmount("");
      setSelectedAccount(null);
      setIsTransactionModalVisible(false);

      await loadAllTransactions();
      await loadPlannedBudgets();
    } catch (err) {
      console.error("Error saving transaction:", err);
      alert("Failed to save transaction.");
    }
  };

  // ---------- UI ----------
  return (
    <View className="items-center">
      <PlannedBudgetModals
        isBudgetModalVisible={isModalVisible}
        setIsBudgetModalVisible={setIsModalVisible}
        selectedBudget={selectedBudget}
        budgetTransactions={budgetTransactions}
        isTransactionModalVisible={isTransactionModalVisible}
        setIsTransactionModalVisible={setIsTransactionModalVisible}
        transactionAmount={transactionAmount}
        setTransactionAmount={setTransactionAmount}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        accounts={accounts}
        handleSaveTransaction={handleSaveTransaction}
        toggleAccountsModal={toggleAccountsModal}
        isAccountsModalVisible={isAccountsModalVisible}
      />
      {/* === Header === */}
      <ReusableRoundedBoxComponent>
        <View className="flex-col px-[32] pt-[8]">
          <View className="flex-row items-center gap-[4] pb-[16]">
            <View className="w-[25] h-[25] bg-white" />
            <Text className="font-medium text-white">Budget Tracker</Text>
          </View>

          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              className="w-[30px] h-[30px] rounded-full flex-row absolute left-0 active:bg-[#F0E4FF]"
              onPress={() => navigation.openDrawer()}
            >
              <SVG_ICONS.SideMenu width={30} height={30} />
            </TouchableOpacity>
            <Text className="text-[16px] font-medium text-white">
              Dashboard
            </Text>
          </View>
        </View>
      </ReusableRoundedBoxComponent>

      {/* === Overview === */}
      <View
        className="w-[330] h-[220] -mt-[46] p-[20] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="pb-[20] flex-row justify-between">
          <Text className="text-[12px] font-medium self-center">Overview</Text>
          <View className="flex-row justify-between gap-x-2">
            <SVG_ICONS.ArrowLeft width={24} height={24} />
            <Text className="text-[12px] font-medium self-center">
              This Week
            </Text>
            <SVG_ICONS.ArrowRight width={24} height={24} />
          </View>
        </View>

        <View className="flex-row justify-between">
          {/* FIX: Use the 'currentProgress' state variable */}
          <ProgressRing
            progress={currentProgress}
            radius={70}
            strokeWidth={15}
            progressColor="#8938E9"
            backgroundColor="#EDE1FB"
            duration={500}
            showPercentage={true}
          />

          <View className="flex-col items-end justify-end pr-[10] pb-[6]">
            <View className="flex-row mb-[4] px-[8] py-[4] gap-[4] bg-[#EDE1FB] rounded-[16]">
              <SVG_ICONS.Insight width={16} height={16} />
              <Text className="text-[12px] text-[#8938E9]">Insight</Text>
            </View>
            <Text className="text-[8px] text-[#392F46] opacity-65">
              You spent 5% more
            </Text>
            <Text className="text-[8px] text-[#392F46] opacity-65">
              than last week
            </Text>
          </View>
        </View>
      </View>

      {/* === Expense & Income === */}
      <View
        className="w-[330] h-[80] my-[16] p-[16] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="flex-row">
          <View className="w-[48] h-[48] bg-[#8938E9] rounded-[16]" />
          <View className="pl-[20] gap-[6] self-center">
            <Text className="text-[12px] text-[#392F46] opacity-65">
              Spent this week:
            </Text>
            <Text className="text-[16px] font-medium">₱800.00</Text>
          </View>
          <View className="flex-1 self-center items-end">
            <SVG_ICONS.ArrowRight width={24} height={24} />
          </View>
        </View>
      </View>

      <View
        className="w-[330] h-[80] p-[16] bg-white rounded-[20]"
        style={{ elevation: 5 }}
      >
        <View className="flex-row">
          <View className="w-[48] h-[48] bg-[#8938E9] rounded-[16]" />
          <View className="pl-[20] gap-[6] self-center">
            <Text className="text-[12px] text-[#392F46] opacity-65">
              Earned this week:
            </Text>
            <Text className="text-[16px] font-medium">₱1300.00</Text>
          </View>
          <View className="flex-1 self-center items-end">
            <SVG_ICONS.ArrowRight width={24} height={24} />
          </View>
        </View>
      </View>

      {/* === Planned Budgets Section === */}
      <View
        className="w-full mt-[32] mb-[16] pl-[32]"
        style={{ overflow: "visible" }}
      >
        <Text className="font-medium text-[16px] mb-[8]">Planned Budgets</Text>

        {loading ? (
          <Text className="text-gray-500">Loading planned budgets...</Text>
        ) : plannedBudgets.length === 0 ? (
          <Text className="text-gray-500">No planned budgets yet.</Text>
        ) : (
          <FlatList
            horizontal
            data={plannedBudgets}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingRight: 32,
              gap: 16,
              paddingBottom: 16,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: budget }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  console.log("📋 [DEBUG] Selected budget:", budget);
                  const filtered = budgetTransactions.filter(
                    (t) => getPlannedBudgetId(t) === budget.id
                  );
                  console.log(
                    `🧾 [DEBUG] Found ${filtered.length} transactions for this budget:`,
                    filtered
                  );
                  setSelectedBudget(budget);
                  setIsModalVisible(true);
                }}
                className="w-[280] h-[140] bg-white rounded-[20]"
                style={{
                  elevation: 6,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  marginBottom: 8,
                }}
              >
                {/* === Header === */}
                <View className="w-full h-[40] rounded-t-[20] overflow-hidden">
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: budget.color_name || "#8938E9",
                      opacity: 0.4,
                    }}
                  />
                  <View className="flex-row gap-[12] items-center h-full px-[16]">
                    <View
                      className="w-[16] h-[16] rounded-[4]"
                      style={{
                        backgroundColor: budget.color_name || "#FCC21B",
                      }}
                    />
                    <Text className="text-[14px] text-[#392F46]">
                      {budget.budget_name || "Unnamed Budget"}
                    </Text>
                  </View>
                </View>

                {/* === Progress & Info === */}
                <View className="py-[16] px-[20]">
                  {/* FIX: Use 'budget' instead of 'selectedBudget' for the current item */}
                  <ProgressBar
                    progress={getProgress(budget, budgetTransactions)}
                  />
                  <View className="mt-[8]">
                    <Text className="text-[14px]">
                      Spent ₱
                      {(
                        Number(budget.amount) *
                        Number(getProgress(budget, budgetTransactions))
                      ).toFixed(0)}{" "}
                      from{" "}
                      <Text className="text-[14px] text-[#8938E9]">
                        ₱{Number(budget.amount).toFixed(0)}
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            style={{ overflow: "visible" }}
          />
        )}
      </View>
    </View>
  );
}
