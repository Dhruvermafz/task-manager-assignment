// components/AddExpenseModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { expenseCategories, paymentMethods } from "@/lib/mockBudgetData";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const AddExpenseModal = ({
  isOpen,
  onClose,
  onSave,
  editExpense = null,
  selectedDate = null,
}) => {
  const [formData, setFormData] = useState({
    date: "",
    category: "food",
    amount: "",
    description: "",
    paymentMethod: "cash",
    recurring: false,
  });

  const [date, setDate] = useState(undefined);

  useEffect(() => {
    if (editExpense) {
      setFormData({
        date: editExpense.date,
        category: editExpense.category,
        amount: editExpense.amount.toString(), // ensure string for input
        description: editExpense.description,
        paymentMethod: editExpense.paymentMethod,
        recurring: editExpense.recurring ?? false,
      });
      if (editExpense.date) {
        setDate(new Date(editExpense.date));
      }
    } else {
      const initialDate = selectedDate || new Date();
      setFormData({
        date: format(initialDate, "yyyy-MM-dd"),
        category: "food",
        amount: "",
        description: "",
        paymentMethod: "cash",
        recurring: false,
      });
      setDate(initialDate);
    }
  }, [editExpense, selectedDate, isOpen]);

  const handleDateSelect = (selected) => {
    setDate(selected);
    if (selected) {
      setFormData({ ...formData, date: format(selected, "yyyy-MM-dd") });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="add-expense-modal">
        <DialogHeader>
          <DialogTitle>
            {editExpense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {editExpense
              ? "Update expense details"
              : "Record a new expense entry"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    data-testid="expense-date-picker"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category + Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger data-testid="expense-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount (₹)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  data-testid="expense-amount-input"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="expense-payment">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger data-testid="expense-payment-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.icon} {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="expense-description">Description</Label>
              <Textarea
                id="expense-description"
                placeholder="What was this expense for?"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                data-testid="expense-description-input"
                rows={2}
              />
            </div>

            {/* Recurring Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={formData.recurring}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, recurring: !!checked })
                }
                data-testid="expense-recurring-checkbox"
              />
              <label
                htmlFor="recurring"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Recurring expense
              </label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" data-testid="save-expense-button">
              {editExpense ? "Update" : "Add"} Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
