import { ACCOUNTS_SVG_ICONS } from "@/assets/constants/accounts_icons";
import { getAccounts } from "@/utils/accounts";
import { getPlannedBudgets, initDatabase } from "@/utils/database";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SVG_ICONS } from "../../../assets/constants/icons";
import ProgressBar from "../../../components/ProgressBar";
import ProgressRing from "../../../components/ProgressRing";
import ReusableRoundedBoxComponent from "../../../components/RoundedBoxComponent";
import type { TabHomeScreenNavigationProp } from "../../../types";

// =========================================================
// 🟣 AccountsModal (AddNewAccount removed)
// =========================================================
const AccountsModal = ({
  isVisible,
  onClose,
  accounts,
  onSelectAccount,
}: {
  isVisible: boolean;
  onClose: () => void;
  accounts: Array<{
    id: number | string;
    name: string;
    balance: number;
    icon_name: string;
  }>;
  onSelectAccount: (account: {
    id: number | string;
    name: string;
    balance: number;
    icon_name: string;
  }) => void;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Text className="text-xl font-bold mb-4">Select Account</Text>

          {accounts.map((account) => {
            const IconComponent = ACCOUNTS_SVG_ICONS[account.icon_name];
            return (
              <TouchableOpacity
                key={account.id}
                className="w-full h-[50] px-4 flex-row justify-between items-center mb-2 active:bg-[#F8F4FF]"
                onPress={() => onSelectAccount(account)} // 👈 Only call this now
              >
                <View className="flex-row gap-2 items-center">
                  <View className="w-[40] h-[40] bg-[#8938E9] rounded-full justify-center items-center">
                    {IconComponent && <IconComponent size={24} color="white" />}
                  </View>
                  <Text className="text-lg">{account.name}</Text>
                </View>
                <Text className="text-[#8938E9] text-lg">
                  ₱{account.balance.toFixed(2)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

// =========================================================
// 🟣 Main Screen
// =========================================================
export default function Index() {
  const navigation = useNavigation<TabHomeScreenNavigationProp>();
  const router = useRouter();

  const [plannedBudgets, setPlannedBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0.25);

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [isAccountsModalVisible, setAccountsModalVisible] = useState(false);
  const [accounts, setAccounts] = useState<
    Array<{
      id: number | string;
      name: string;
      balance: number;
      icon_name: string;
    }>
  >([]);
  const [selectedAccount, setSelectedAccount] = useState<null | {
    id: number | string;
    name: string;
    balance: number;
    icon_name: string;
  }>(null);
  const [dbReady, setDbReady] = useState(false);

  // 🧩 Initialize DB + load accounts
  useEffect(() => {
    async function setupDatabaseAndLoadAccounts() {
      try {
        await initDatabase();
        const initialAccounts = await getAccounts();
        setAccounts(initialAccounts);
        setDbReady(true);
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

  // 🧾 Transaction form states
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionNote, setTransactionNote] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const loadPlannedBudgets = useCallback(async () => {
    try {
      setLoading(true);
      await initDatabase();
      const budgets = await getPlannedBudgets();
      setPlannedBudgets(budgets);
    } catch (error) {
      console.error("❌ Error loading planned budgets:", error);
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
    }, [loadPlannedBudgets])
  );

  const getProgress = (budget) => 0.6;

  const handleSaveTransaction = () => {
    if (!transactionAmount) {
      alert("Please enter an amount.");
      return;
    }
    console.log("💾 Transaction Saved:", {
      budgetId: selectedBudget?.id,
      amount: transactionAmount,
      note: transactionNote,
      date: transactionDate,
      account: selectedAccount,
    });
    setTransactionAmount("");
    setTransactionNote("");
    setTransactionDate("");
    setSelectedAccount(null);
    setIsTransactionModalVisible(false);
  };

  return (
    <View className="items-center">
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
                  <ProgressBar progress={getProgress(budget)} />
                  <View className="mt-[8]">
                    <Text className="text-[14px]">
                      Spent ₱{(budget.amount * getProgress(budget)).toFixed(0)}{" "}
                      from{" "}
                      <Text className="text-[14px] text-[#8938E9]">
                        ₱{budget.amount.toFixed(0)}
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

      {/* === Budget Details Modal === */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[360] h-[700] bg-white rounded-[20] p-[20] shadow-lg">
            {selectedBudget ? (
              <>
                <View className="flex-row gap-4 items-center pb-5">
                  <View
                    className="w-[40] h-[40] rounded-full"
                    style={{
                      backgroundColor: selectedBudget.color_name || "#FCC21B",
                    }}
                  />
                  <View className="flex-col">
                    <Text className="text-[18px] font-medium text-[#392F46]">
                      {selectedBudget.budget_name || "Unnamed Budget"}
                    </Text>
                    <Text className="text-[14px] text-[#392F46] opacity-70">
                      {selectedBudget.budget_type + " category" ||
                        "Unnamed Budget"}
                    </Text>
                  </View>
                </View>

                <Text className="text-[14px] text-[#392F46] mb-[4]">
                  Goal Amount: ₱{selectedBudget.amount.toFixed(2)}
                </Text>
                <Text className="text-[14px] text-[#392F46] mb-[4]">
                  Start Date: {selectedBudget.start_date || "Ongoing"}
                </Text>
                <Text className="text-[14px] text-[#392F46] mb-[4]">
                  End Date: {selectedBudget.end_date || "Ongoing"}
                </Text>
                <Text className="text-[14px] text-[#392F46] mb-[4]">
                  Progress: {(getProgress(selectedBudget) * 100).toFixed(0)}%
                </Text>

                <View className="mt-4">
                  <Text className="text-[16px] font-bold">Savings Record</Text>
                </View>

                <ScrollView>
                  <View className="mt-4">
                    <View className="gap-2">
                      <Text>April 12, 2025</Text>
                      <View className="w-full border"></View>
                      <View className="flex-row justify-between">
                        <View className="flex-row gap-2">
                          <Text>7:00pm</Text>
                          <Text>Pocket Money</Text>
                        </View>
                        <Text>P1000.00</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <View className="flex-row gap-4">
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(false);
                      setIsTransactionModalVisible(true);
                    }}
                    className="flex-1 mt-[16] bg-[#8938E9] px-[16] py-[10] rounded-[12]"
                  >
                    <Text className="text-white text-center font-medium">
                      CREATE TRANSACTION
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    className="flex-1 mt-[16] bg-[#8938E9] px-[16] py-[10] rounded-[12] justify-center"
                  >
                    <Text className="text-white text-center font-medium">
                      CLOSE
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* === Transaction Modal === */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTransactionModalVisible}
        onRequestClose={() => setIsTransactionModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[360] bg-white rounded-[20] p-[20] shadow-lg">
            <Text className="text-[18px] font-semibold text-[#392F46] mb-[16]">
              Create Budget Transaction
            </Text>

            <TextInput
              placeholder="Amount (₱)"
              keyboardType="numeric"
              value={transactionAmount}
              onChangeText={setTransactionAmount}
              className="w-full border border-gray-300 rounded-[12] p-[10] mb-4"
            />

            <View className="mb-4">
              <Text className="mb-2">Account:</Text>
              <TouchableOpacity
                onPress={toggleAccountsModal}
                className="w-full h-12 flex-row gap-4 justify-center items-center bg-[#8938E9] rounded-lg"
              >
                <SVG_ICONS.Account size={16} color="white" />
                <Text className="text-white text-base">
                  {selectedAccount ? selectedAccount.name : "Select Account"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-4 mt-[20]">
              <TouchableOpacity
                onPress={handleSaveTransaction}
                className="flex-1 bg-[#8938E9] px-[16] py-[10] rounded-[12]"
              >
                <Text className="text-white text-center font-medium">SAVE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsTransactionModalVisible(false)}
                className="flex-1 bg-gray-400 px-[16] py-[10] rounded-[12]"
              >
                <Text className="text-white text-center font-medium">
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>

            {/* Accounts modal */}
            <AccountsModal
              isVisible={isAccountsModalVisible}
              onClose={toggleAccountsModal}
              accounts={accounts}
              onSelectAccount={(acc) => {
                setSelectedAccount(acc);
                setAccountsModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
