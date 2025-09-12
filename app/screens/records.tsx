import { CATEGORIES_EXPENSES_SVG_ICONS } from '@/assets/constants/categories_expenses_icons';
import { CATEGORIES_INCOME_SVG_ICONS } from '@/assets/constants/categories_income_icons';
import { SVG_ICONS } from '@/assets/constants/icons';
import { seedDefaultCategories } from '@/database/categoryDefaultSelection';
import { initDatabase } from '@/utils/database';
import { addSampleTransactions, getAllTransactions } from '@/utils/transactions';
import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

export default function Records() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function loadTransactions() {
      try {
        await initDatabase();
        seedDefaultCategories();
        addSampleTransactions();

        const allTransactions = await getAllTransactions();
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    }
    loadTransactions();
  }, []);

  const groupTransactionsByDate = (transactionsList) => {
    const groupedData = {};
    transactionsList.forEach(transaction => {
      const date = new Date(transaction.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      if (!groupedData[day]) {
        groupedData[day] = [];
      }
      groupedData[day].push(transaction);
    });

    return Object.keys(groupedData).map(date => ({
      title: date,
      data: groupedData[date]
    }));
  };

  const sections = groupTransactionsByDate(transactions);

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions recorded yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SVG_ICONS.Search size={30} />
        <SVG_ICONS.Transfer size={24} />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.separator} />
          </View>
        )}
        renderItem={({ item }) => {
          let IconComponent;
          let iconBgColor;
          let mainText;
          let amountText;
          let amountColor;

          // Use the `item.type` field to set the display properties
          if (item.type === 'income') {
            const categoryIconName = item.category_icon_name || 'OtherIncome';
            const categoryName = item.category_name || 'Other Income';
            IconComponent = CATEGORIES_INCOME_SVG_ICONS?.[categoryIconName] || SVG_ICONS.Category;
            iconBgColor = '#8938E9'; // A distinct color for income
            mainText = categoryName;
            amountText = `+₱${item.amount.toFixed(2)}`;
            amountColor = '#8938E9';

          } else if (item.type === 'expense') {
            const categoryIconName = item.category_icon_name || 'OtherExpenses';
            const categoryName = item.category_name || 'Other Expenses';
            IconComponent = CATEGORIES_EXPENSES_SVG_ICONS?.[categoryIconName] || SVG_ICONS.Category;
            iconBgColor = '#000000'; // A distinct color for expense
            mainText = categoryName;
            amountText = `-₱${item.amount.toFixed(2)}`;
            amountColor = '#000000';

          } else if (item.type === 'transfer') { // New logic for transfers
            IconComponent = SVG_ICONS.Transfer;
            iconBgColor = '#6b7280';
            mainText = `Transfer from ${item.account_name} to ${item.to_account_name}`;
            amountText = `${item.amount.toFixed(2)}`;
            amountColor = '#6b7280';

          } else { // Fallback for any other types
            IconComponent = SVG_ICONS.Category;
            iconBgColor = '#6b7280';
            mainText = 'Unknown Transaction';
            amountText = `${item.amount.toFixed(2)}`;
            amountColor = '#6b7280';
          }

          return (
            <View style={styles.transactionItem}>
              <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                {IconComponent && <IconComponent size={24} color="white" />}
              </View>
              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.categoryName}>{mainText}</Text>
                  <Text style={[styles.amount, { color: amountColor }]}>{amountText}</Text>
                </View>
                {/* Optional: Add a second line for notes or account names if needed for clarity */}
                <Text style={styles.subText}>{item.description}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'gray',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'column',
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: '500',
  },
  separator: {
    height: 2,
    backgroundColor: 'black',
    borderRadius: 999,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: 'gray',
  }
});