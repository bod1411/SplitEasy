import { useState } from "react";
import { Users, Plus, Trash2, User } from "lucide-react";
import { type Friend, type InsertFriend, insertFriendSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface FriendsSectionProps {
  friends: Friend[];
  onAddFriend: (friend: InsertFriend) => void;
  onRemoveFriend: (friendId: string) => void;
}

export default function FriendsSection({ friends, onAddFriend, onRemoveFriend }: FriendsSectionProps) {
  const [newFriendName, setNewFriendName] = useState("");
  const { toast } = useToast();

  const handleAddFriend = () => {
    if (!newFriendName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a friend's name",
      });
      return;
    }

    try {
      const friendData = insertFriendSchema.parse({
        name: newFriendName.trim(),
      });
      
      onAddFriend(friendData);
      setNewFriendName("");
      
      toast({
        title: "Success",
        description: `${friendData.name} has been added to the group`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add friend",
      });
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    try {
      onRemoveFriend(friendId);
      toast({
        title: "Success",
        description: "Friend has been removed from the group",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove friend",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddFriend();
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-2xl font-semibold text-primary-text">
          <Users className="text-total-blue text-xl mr-3" />
          Friends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Friend Form */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add friend's name"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-total-blue focus:outline-none text-primary-text placeholder-secondary-text"
          />
          <Button
            onClick={handleAddFriend}
            className="bg-total-blue hover:bg-total-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Plus size={20} />
          </Button>
        </div>

        {/* Friends List */}
        <div className="space-y-2">
          {friends.length === 0 ? (
            <div className="text-center py-8 text-secondary-text">
              <Users className="mx-auto mb-2" size={48} />
              <p>No friends added yet</p>
              <p className="text-sm">Add friends to start splitting expenses</p>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <User className="text-secondary-text mr-3" size={20} />
                  <span className="text-primary-text font-medium">{friend.name}</span>
                  {friend.name === "You" && (
                    <Badge className="ml-2 bg-total-blue text-white text-xs">
                      Host
                    </Badge>
                  )}
                </div>
                {friend.name !== "You" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="text-red-500 hover:text-red-700 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
