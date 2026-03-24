import Foundation
import WidgetKit
import SwiftUI

// MARK: - Entry Model
struct ExamWidgetEntry: TimelineEntry {
    let date: Date
    let examName: String
    let daysLeft: Int
    let hoursLeft: Int
    let streak: Int
    let motivation: String
    let urgencyLevel: UrgencyLevel
}

// MARK: - Urgency Level
enum UrgencyLevel: String {
    case low = "🟢"
    case medium = "🟡"
    case high = "🔴"
    
    var bgColor: Color {
        switch self {
        case .low:
            return Color.green
        case .medium:
            return Color.yellow
        case .high:
            return Color.red
        }
    }
}

// MARK: - Timeline Provider
struct ExamWidgetTimelineProvider: TimelineProvider {
    
    func placeholder(in context: Context) -> ExamWidgetEntry {
        ExamWidgetEntry(
            date: Date(),
            examName: "SSC CGL",
            daysLeft: 45,
            hoursLeft: 12,
            streak: 5,
            motivation: "You're doing great!",
            urgencyLevel: .low
        )
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<ExamWidgetEntry>) -> ()) {
        let currentDate = Date()
        let nextUpdateDate = Calendar.current.date(byAdding: .hour, value: 1, to: currentDate)!
        
        let examName = "SSC CGL"
        let daysLeft = 45
        let hoursLeft = 12
        let streak = 5
        let motivation = "You're doing great! 🚀"
        
        let urgencyLevel: UrgencyLevel = daysLeft > 60 ? .low : (daysLeft > 30 ? .medium : .high)
        
        let entry = ExamWidgetEntry(
            date: currentDate,
            examName: examName,
            daysLeft: daysLeft,
            hoursLeft: hoursLeft,
            streak: streak,
            motivation: motivation,
            urgencyLevel: urgencyLevel
        )
        
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
        completion(timeline)
    }

    func recommendations() -> [WidgetTimeline.Recommendation] {
        return []
    }
}

// MARK: - Widget View
struct ExamWidgetView: View {
    let entry: ExamWidgetEntry
    
    var body: some View {
        ZStack {
            // Background
            Color(.systemBackground)
            
            VStack(spacing: 12) {
                // Header
                VStack(alignment: .leading, spacing: 4) {
                    Text(entry.examName)
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    Text("SSC Exam")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                // Countdown Box
                HStack(spacing: 20) {
                    VStack(spacing: 4) {
                        Text(String(entry.daysLeft))
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.white)
                        
                        Text("Days")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(12)
                    .background(entry.urgencyLevel.bgColor)
                    .cornerRadius(8)
                    
                    VStack(spacing: 4) {
                        Text("🔥")
                            .font(.title3)
                        
                        Text(String(entry.streak))
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                        
                        Text("Streak")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(12)
                    .background(Color.orange)
                    .cornerRadius(8)
                }
                
                // Motivation
                Text(entry.motivation)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .lineLimit(2)
                    .padding(8)
                    .frame(maxWidth: .infinity)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(6)
            }
            .padding(12)
        }
    }
}

// MARK: - Widget Bundle
@main
struct ExamWidget: Widget {
    let kind: String = "com.aspirantwidget.examwidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: kind,
            provider: ExamWidgetTimelineProvider()
        ) { entry in
            ExamWidgetView(entry: entry)
        }
        .configurationDisplayName("Exam Countdown")
        .description("Track your exam countdown and study streak")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Preview
struct ExamWidget_Previews: PreviewProvider {
    static var previews: some View {
        ExamWidgetView(
            entry: ExamWidgetEntry(
                date: Date(),
                examName: "SSC CGL",
                daysLeft: 45,
                hoursLeft: 12,
                streak: 5,
                motivation: "You're doing great!",
                urgencyLevel: .low
            )
        )
        .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
