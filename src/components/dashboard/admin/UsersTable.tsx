
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { updateUser } from "@/lib/action/users";
import type {
  TFixMateAdminUser,
  TFixMateRole,
} from "@/lib/api/users";

const ROLES: TFixMateRole[] = [
  "customer",
  "technician",
  "admin",
];

const ROLE_LABELS: Record<TFixMateRole, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

type UsersTableProps = {
  users: TFixMateAdminUser[];
  currentUserId: string;
};

const UsersTable = ({
  users,
  currentUserId,
}: UsersTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="pr-4">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                isCurrentUser={user._id === currentUserId}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const UserRow = ({
  user,
  isCurrentUser,
}: {
  user: TFixMateAdminUser;
  isCurrentUser: boolean;
}) => {
  const [role, setRole] = useState<TFixMateRole>(user.role);
  const [isPending, startTransition] = useTransition();

  const hasChanges = role !== user.role;

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateUser({
        userId: user._id,
        role,
      });

      toast.add({
        title: result.success ? "User updated" : "Update failed",
        description: result.message,
      });
    });
  };

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "—";

  return (
    <TableRow>
      <TableCell className="pl-4 font-medium">
        <div className="flex items-center gap-2">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="size-9 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-9 place-items-center rounded-full bg-muted text-sm font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <p>{user.name || "Unnamed user"}</p>
            {isCurrentUser && (
              <span className="text-xs text-muted-foreground">
                (You)
              </span>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {user.email}
      </TableCell>

      <TableCell>
        <NativeSelect
          value={role}
          onChange={(event) =>
            setRole(event.target.value as TFixMateRole)
          }
          disabled={isCurrentUser || isPending}
        >
          {ROLES.map((item) => (
            <NativeSelectOption key={item} value={item}>
              {ROLE_LABELS[item]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {joinedDate}
      </TableCell>

      <TableCell className="pr-4">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isCurrentUser || isPending}
          className="bg-[#15295e] text-white hover:bg-[#1e3a80]"
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UsersTable;
