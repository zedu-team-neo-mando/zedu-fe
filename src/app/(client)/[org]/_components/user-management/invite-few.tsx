import { isValidEmail } from "~/lib/utils";
import React, { useEffect, useCallback } from "react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { InviteUser, Role } from "./invite-modal";

interface User {
  id: string;
  email: string;
  role: string;
  emailError?: string;
}

const InviteFew = ({
  users,
  setUsers,
  roles,
  onUsersChange,
}: {
  users: User[];

  setUsers: (users: User[]) => void;
  roles: Role[];

  onUsersChange: (users: InviteUser[]) => void;
}) => {
  const addRow = () => {
    const newUser: User = {
      id: Date.now().toString(),
      email: "",
      role: "",
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (
    id: string,
    field: keyof Omit<User, "id" | "emailError">,
    value: string
  ) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        if (field === "email") {
          const emailError =
            value && !isValidEmail(value)
              ? "Please enter a valid email address"
              : undefined;
          return { ...user, [field]: value, emailError };
        }
        return { ...user, [field]: value };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const removeUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleUsersChange = useCallback(() => {
    const formattedUsers = users
      .filter((user) => user.email && user.role && !user.emailError)
      .map(({ email, role }) => ({
        email,
        role,
      }));
    onUsersChange(formattedUsers);
  }, [users, onUsersChange]);

  useEffect(() => {
    handleUsersChange();
  }, [handleUsersChange]);

  return (
    <div className="w-full max-w-4xl mx-auto border-none">
      <div className="space-y-6 max-h-[400px] overflow-auto px-6">
        {users.map((user, index) => (
          <div className="!mt-3" key={index}>
            <div
              key={user.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
            >
              <div className="md:col-span-7 space-y-2">
                <Label
                  htmlFor={`email-${user.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="space-y-1">
                  <Input
                    id={`email-${user.id}`}
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      updateUser(user.id, "email", e.target.value)
                    }
                    placeholder="Enter email address"
                    className={`w-full ${user.emailError ? "border-red-500" : ""}`}
                  />
                </div>
              </div>
              <div className="md:col-span-4 space-y-2">
                <Label
                  htmlFor={`role-${user.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Role
                </Label>
                <Select
                  value={user.role}
                  onValueChange={(value) => updateUser(user.id, "role", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles &&
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1 flex">
                {users.length > 1 && index !== 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUser(user.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-white !p-0"
                  >
                    <Trash2 className="h-5 w-5" color="black" />
                  </Button>
                )}
              </div>
            </div>
            {user.emailError && (
              <div className="text-red-500 text-sm mt-1">{user.emailError}</div>
            )}
          </div>
        ))}

        <div className="!mt-0">
          <Button
            onClick={addRow}
            variant="ghost"
            className="text-[#7141F8] hover:text-blue-700 hover:bg-white font-medium px-0"
          >
            Add Row
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteFew;
