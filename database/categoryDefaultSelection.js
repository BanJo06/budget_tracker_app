export const seedDefaultCategories = (db) => {
    try {
        console.log("Seeding default categories...");
        db.withTransactionSync(() => {
            // Default expense categories with their icons
            const expenseCategories = [
                // The icon_name here must match the key in your icon map
                { name: 'Bills', icon_name: 'Bills' },
                { name: 'Clothing', icon_name: 'Clothing' },
                { name: 'Foods', icon_name: 'Foods' },
                { name: 'Shopping', icon_name: 'Shopping' },
                { name: 'Tuition', icon_name: 'Tuition' }
            ];

            // Default income categories with their icons
            const incomeCategories = [
                { name: 'Allowance', icon_name: 'Allowance' },
                { name: 'Lottery', icon_name: 'Lottery' },
                { name: 'Refunds', icon_name: 'Refunds' },
                { name: 'Salary', icon_name: 'Salary' },
                { name: 'Sideline', icon_name: 'Sideline' },
            ];

            // Insert expense categories
            expenseCategories.forEach(cat => {
                db.runSync(`
                    INSERT OR IGNORE INTO expense_categories (name, icon_name)
                    VALUES (?, ?);
                `, [cat.name, cat.icon_name]);
            });

            // Insert income categories
            incomeCategories.forEach(cat => {
                db.runSync(`
                    INSERT OR IGNORE INTO income_categories (name, icon_name)
                    VALUES (?, ?);
                `, [cat.name, cat.icon_name]);
            });
        });
        console.log("Default categories seeded successfully.");
    } catch (error) {
        console.error("Error seeding default categories:", error);
    }
};