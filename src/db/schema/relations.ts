import { relations } from "drizzle-orm/relations";
import { group, participant, contact, community, subjectClass, classConstraint, major, constraintMajor, classSchedule, curricula, subject, semester, classReminder, classFollower, majorInConstraint, room, roomInClass, lecturerInClass, lecturer, userWordle, wordle, sawit, groupSettings, sawitAttack } from "./index";

export const groupRelations = relations(group, ({ one, many }) => ({
	participants: many(participant),
	community: one(community, {
		fields: [group.communityId],
		references: [community.id]
	}),
	contacts: many(contact),
	groupSettings: one(groupSettings, {
		fields: [group.id],
		references: [groupSettings.id]
	}),
	sawitAttacks: many(sawitAttack),
}));

export const participantRelations = relations(participant, ({ one, many }) => ({
	group: one(group, {
		fields: [participant.groupId],
		references: [group.id]
	}),
	contact: one(contact, {
		fields: [participant.contactId],
		references: [contact.id]
	}),
	sawits: one(sawit, {
		fields: [participant.id],
		references: [sawit.participantId]
	}),
	sawitAttacks_participantId: many(sawitAttack, {
		relationName: "sawitAttack_participantId_participant_id"
	}),
	sawitAttacks_acceptedBy: many(sawitAttack, {
		relationName: "sawitAttack_acceptedBy_participant_id"
	}),
}));

export const contactRelations = relations(contact, ({ one, many }) => ({
	participants: many(participant),
	group: one(group, {
		fields: [contact.confessTarget],
		references: [group.id]
	}),
	userWordles: many(userWordle),
}));

export const communityRelations = relations(community, ({ many }) => ({
	groups: many(group),
}));

export const classConstraintRelations = relations(classConstraint, ({ one, many }) => ({
	subjectClass: one(subjectClass, {
		fields: [classConstraint.subjectClassId],
		references: [subjectClass.id]
	}),
	majorInConstraints: many(majorInConstraint),
}));

export const subjectClassRelations = relations(subjectClass, ({ one, many }) => ({
	classConstraints: many(classConstraint),
	classSchedules: many(classSchedule),
	major: one(major, {
		fields: [subjectClass.majorId],
		references: [major.id]
	}),
	semester: one(semester, {
		fields: [subjectClass.semesterId],
		references: [semester.id]
	}),
	subject: one(subject, {
		fields: [subjectClass.subjectId],
		references: [subject.id]
	}),
	classReminders: many(classReminder),
	classFollowers: many(classFollower),
	lecturerInClasses: many(lecturerInClass),
}));

export const constraintMajorRelations = relations(constraintMajor, ({ one, many }) => ({
	major: one(major, {
		fields: [constraintMajor.majorId],
		references: [major.id]
	}),
	majorInConstraints: many(majorInConstraint),
}));

export const majorRelations = relations(major, ({ many }) => ({
	constraintMajors: many(constraintMajor),
	subjectClasses: many(subjectClass),
}));

export const classScheduleRelations = relations(classSchedule, ({ one, many }) => ({
	subjectClass: one(subjectClass, {
		fields: [classSchedule.subjectClassId],
		references: [subjectClass.id]
	}),
	roomInClasses: many(roomInClass),
}));

export const subjectRelations = relations(subject, ({ one, many }) => ({
	curriculum: one(curricula, {
		fields: [subject.curriculaYear],
		references: [curricula.year]
	}),
	subjectClasses: many(subjectClass),
}));

export const curriculaRelations = relations(curricula, ({ many }) => ({
	subjects: many(subject),
}));

export const semesterRelations = relations(semester, ({ many }) => ({
	subjectClasses: many(subjectClass),
}));

export const classReminderRelations = relations(classReminder, ({ one }) => ({
	subjectClass: one(subjectClass, {
		fields: [classReminder.subjectClassId],
		references: [subjectClass.id]
	}),
}));

export const classFollowerRelations = relations(classFollower, ({ one }) => ({
	subjectClass: one(subjectClass, {
		fields: [classFollower.subjectClassId],
		references: [subjectClass.id]
	}),
}));

export const userWordleRelations = relations(userWordle, ({ one }) => ({
	contact: one(contact, {
		fields: [userWordle.userId],
		references: [contact.id]
	}),
	wordle: one(wordle, {
		fields: [userWordle.targetId],
		references: [wordle.id]
	}),
}));

export const wordleRelations = relations(wordle, ({ many }) => ({
	userWordles: many(userWordle),
}));

export const sawitRelations = relations(sawit, ({ one }) => ({
	participant: one(participant, {
		fields: [sawit.participantId],
		references: [participant.id]
	}),
}));

export const groupSettingsRelations = relations(groupSettings, ({ one }) => ({
	group: one(group, {
		fields: [groupSettings.id],
		references: [group.id]
	}),
}));

export const sawitAttackRelations = relations(sawitAttack, ({ one }) => ({
	group: one(group, {
		fields: [sawitAttack.groupId],
		references: [group.id]
	}),
	participant_participantId: one(participant, {
		fields: [sawitAttack.participantId],
		references: [participant.id],
		relationName: "sawitAttack_participantId_participant_id"
	}),
	participant_acceptedBy: one(participant, {
		fields: [sawitAttack.acceptedBy],
		references: [participant.id],
		relationName: "sawitAttack_acceptedBy_participant_id"
	}),
}));

export const majorInConstraintRelations = relations(majorInConstraint, ({ one }) => ({
	constraintMajor: one(constraintMajor, {
		fields: [majorInConstraint.constraintMajorId],
		references: [constraintMajor.id]
	}),
	classConstraint: one(classConstraint, {
		fields: [majorInConstraint.classConstraintId],
		references: [classConstraint.id]
	}),
}));

export const roomInClassRelations = relations(roomInClass, ({ one }) => ({
	room: one(room, {
		fields: [roomInClass.roomId],
		references: [room.id]
	}),
	classSchedule: one(classSchedule, {
		fields: [roomInClass.classScheduleId],
		references: [classSchedule.id]
	}),
}));

export const roomRelations = relations(room, ({ many }) => ({
	roomInClasses: many(roomInClass),
}));

export const lecturerInClassRelations = relations(lecturerInClass, ({ one }) => ({
	subjectClass: one(subjectClass, {
		fields: [lecturerInClass.subjectClassId],
		references: [subjectClass.id]
	}),
	lecturer: one(lecturer, {
		fields: [lecturerInClass.lecturerId],
		references: [lecturer.id]
	}),
}));

export const lecturerRelations = relations(lecturer, ({ many }) => ({
	lecturerInClasses: many(lecturerInClass),
}));
