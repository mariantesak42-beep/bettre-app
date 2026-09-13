import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, startSession } from "@/lib/auth";

const ADJECTIVES = ["Bold", "Curious", "Zesty", "Sneaky", "Lucky", "Brave", "Chill", "Feisty", "Sunny", "Wild"];
const ANIMALS = ["Otter", "Panda", "Falcon", "Fox", "Yak", "Koala", "Lynx", "Puffin", "Badger", "Heron"];

function randomGuestName(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `${adjective} ${animal} ${suffix}`;
}

// Lets a visitor try the full app with zero signup friction — creates a real
// User + Session under the hood (same as signup), just with a generated name
// and a throwaway email/password nobody ever needs to know.
export async function POST() {
  const user = await prisma.user.create({
    data: {
      name: randomGuestName(),
      email: `guest-${randomBytes(6).toString("hex")}@bettre.demo`,
      passwordHash: hashPassword(randomBytes(16).toString("hex")),
    },
  });

  await startSession(user.id);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
